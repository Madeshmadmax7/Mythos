import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation, useParams, matchPath } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import AccessRequestModal from "./components/AccessRequestModal";
import Login from "./components/Login";
import HomePage from "./pages/HomePage";
import DocsPage from "./pages/DocsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const API_BASE = "http://localhost:8000/api";
const STORY_TOOLS_STORAGE_KEY = "story_tools_by_id_v1";

const DEFAULT_STORY_TOOLS = {
  strictness: "strict_canon",
  maxWords: 450,
  noNewCharacters: true,
  scienceStrict: false,
  pinnedFacts: "",
  characterBible: "",
};

function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Stories state
  const [stories, setStories] = useState([]);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  // Messages
  const [messages, setMessages] = useState([]);

  // Input
  const [inputText, setInputText] = useState("");
  const [genre, setGenre] = useState("fantasy");

  // States
  const [loading, setLoading] = useState(false);
  const [refiningId, setRefiningId] = useState(null);
  const [error, setError] = useState("");
  const [newMessageId, setNewMessageId] = useState(null); // Track newly generated message for typing animation

  // Access Request Modal State
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessStoryHash, setAccessStoryHash] = useState(null);
  const [isAccessPending, setIsAccessPending] = useState(false);

  // Reactions and reviews state
  const [reactions, setReactions] = useState({}); // { [messageId]: { type, likes, dislikes } }
  const [reviews, setReviews] = useState({}); // { [messageId]: [reviews] }

  // Toast notifications
  const [toasts, setToasts] = useState([]);
  const [storyToolsById, setStoryToolsById] = useState(() => {
    try {
      const raw = localStorage.getItem(STORY_TOOLS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  // Router hooks (must be called before any conditional returns)
  const location = useLocation();
  const navigate = useNavigate();
  const isAppRoute = location.pathname === '/app' || location.pathname.startsWith('/app/m/');

  // Handle routing based on URL hash
  const match = matchPath("/app/m/:hashId", location.pathname);
  const hashId = match ? match.params.hashId : null;

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      validateToken(storedToken);
    } else {
      setAuthLoading(false);
    }
  }, []);

  const validateToken = async (storedToken) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setToken(storedToken);
      } else {
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Token validation failed:", err);
      localStorage.removeItem("token");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoginSuccess = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setStories([]);
    setMessages([]);
    setSelectedStoryId(null);
  };

  useEffect(() => {
    localStorage.setItem(STORY_TOOLS_STORAGE_KEY, JSON.stringify(storyToolsById));
  }, [storyToolsById]);

  // Load stories on start (only when authenticated)
  useEffect(() => {
    if (user && token) {
      fetchStories();
    }
  }, [user, token]);

  // Sync selected story with URL hash
  useEffect(() => {
    if (user && token) {
      if (hashId) {
        const story = stories.find(s => s.hash_id === hashId);
        if (story) {
          if (selectedStoryId !== story.id) {
            setSelectedStoryId(story.id);
            setSelectedStory(story);
            fetchMessages(story.id);
            setNewMessageId(null); // Reset typing animation state
          }
        } else {
          fetchStoryByHash(hashId);
        }
      } else if (!hashId && selectedStoryId && isAppRoute && !location.pathname.startsWith('/app/m/')) {
        // Deselect if on /app root
        setSelectedStoryId(null);
        setSelectedStory(null);
        setMessages([]);
      }
    }
  }, [hashId, stories, user, token, location.pathname]);

  const fetchStoryByHash = async (hashId) => {
    try {
      const res = await fetch(`${API_BASE}/stories/hash/${hashId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const story = await res.json();
        if (story.access_level === 'pending') {
          setAccessStoryHash(hashId);
          setIsAccessPending(true);
          setShowAccessModal(true);
          return;
        }
        setStories(prev => {
          if (!prev.find(s => s.id === story.id)) return [story, ...prev];
          return prev;
        });
        setSelectedStoryId(story.id);
        setSelectedStory(story);
        fetchMessages(story.id);
        setNewMessageId(null); // Reset typing animation state
        setIsAccessPending(false);
        setShowAccessModal(false);
      } else if (res.status === 403) {
        // Show access request modal
        setAccessStoryHash(hashId);
        setShowAccessModal(true);
      } else {
        navigate('/app');
      }
    } catch (e) {
      console.error("Error fetching story by hash", e);
      navigate('/app');
    }
  }



  // Effect to sync localStorage removed - URL is source of truth
  // We keep fetchMessages logic inside the routing effect or handler


  const fetchStories = async () => {
    try {
      const res = await fetch(`${API_BASE}/stories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setStories(await res.json());
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error("Failed to fetch stories:", err);
    }
  };

  const fetchMessages = async (storyId) => {
    try {
      const res = await fetch(`${API_BASE}/stories/${storyId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const msgs = await res.json();
        setMessages(msgs);
        // Fetch reactions and reviews for all loaded messages
        if (msgs.length > 0) {
          fetchReactionsAndReviews(msgs.map((m) => m.id));
        }
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const handleNewStory = () => {
    navigate('/app');
    setSelectedStoryId(null);
    setSelectedStory(null);
    setMessages([]);
    setInputText("");
    setError("");
  };

  const handleSelectStory = (story) => {
    navigate(`/app/m/${story.hash_id}`);
    setError("");
  };

  const getActiveStoryTools = () => {
    if (!selectedStoryId) {
      return {
        ...DEFAULT_STORY_TOOLS,
        ...(storyToolsById.default || {}),
      };
    }
    return {
      ...DEFAULT_STORY_TOOLS,
      ...(storyToolsById[String(selectedStoryId)] || {}),
    };
  };

  const updateActiveStoryTools = (partial) => {
    const key = selectedStoryId ? String(selectedStoryId) : "default";
    setStoryToolsById((prev) => {
      const existing = {
        ...DEFAULT_STORY_TOOLS,
        ...(prev[key] || {}),
      };
      return {
        ...prev,
        [key]: {
          ...existing,
          ...partial,
        },
      };
    });
  };

  const buildPromptWithConstraints = (rawPrompt) => {
    const tools = getActiveStoryTools();
    const lines = [];
    const strictnessMode = tools.scienceStrict ? "hard_science" : tools.strictness;

    lines.push("[STORY_CONSTRAINTS]");
    lines.push(`STRICTNESS_MODE=${strictnessMode}`);
    lines.push(`MAX_WORDS=${tools.maxWords}`);
    lines.push(`NO_NEW_CHARACTERS=${tools.noNewCharacters ? "true" : "false"}`);
    lines.push(`SCIENCE_STRICT=${tools.scienceStrict ? "true" : "false"}`);
    lines.push("INSTRUCTIONS:");
    lines.push("- Continue exactly from the previous scene.");
    lines.push("- Keep all character names and identities unchanged.");
    lines.push("- Follow the user's request strictly in this turn.");
    lines.push("- Do not exceed MAX_WORDS.");
    if (tools.noNewCharacters) {
      lines.push("- Do not introduce new named characters.");
    }
    if (tools.scienceStrict || strictnessMode === "hard_science") {
      lines.push("- Enforce real-world science and reject impossible physics/biology/chemistry.");
    }
    if (tools.pinnedFacts?.trim()) {
      lines.push("PinnedFacts:");
      lines.push(tools.pinnedFacts.trim());
    }
    if (tools.characterBible?.trim()) {
      lines.push("CharacterBible:");
      lines.push(tools.characterBible.trim());
    }
    lines.push("[/STORY_CONSTRAINTS]");
    lines.push("");
    lines.push(rawPrompt);

    return lines.join("\n");
  };

  const handleExportStory = (format = "txt") => {
    if (!selectedStory || messages.length === 0) {
      showToast("No story content to export", "info");
      return;
    }

    const title = selectedStory.story_name || `story-${selectedStory.id}`;
    const safeTitle = title.replace(/[^a-z0-9-_]+/gi, "_").toLowerCase();

    let content = "";
    if (format === "md") {
      content += `# ${title}\n\n`;
      content += `Genre: ${selectedStory.genre || "unknown"}\n\n`;
      messages.forEach((m, i) => {
        content += `## Turn ${i + 1}\n\n`;
        content += `**User:** ${m.user_prompt}\n\n`;
        content += `**AI:**\n${m.ai_response}\n\n`;
      });
    } else {
      content += `${title}\n`;
      content += `${"=".repeat(title.length)}\n\n`;
      content += `Genre: ${selectedStory.genre || "unknown"}\n\n`;
      messages.forEach((m, i) => {
        content += `Turn ${i + 1}\n`;
        content += `User: ${m.user_prompt}\n`;
        content += `AI: ${m.ai_response}\n\n`;
      });
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeTitle}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast(`Exported as .${format}`);
  };

  const handleGenerateRecap = () => {
    if (messages.length === 0) {
      showToast("No messages yet for recap", "info");
      return;
    }

    const last = messages[messages.length - 1];
    const recapLines = [
      `Story has ${messages.length} turns.`,
      `Latest user intent: ${last.user_prompt.slice(0, 140)}${last.user_prompt.length > 140 ? "..." : ""}`,
    ];

    const hints = messages.map((m) => m.hint_context).filter(Boolean).slice(-5);
    if (hints.length > 0) {
      recapLines.push(`Recent memory hints: ${hints.join(" | ")}`);
    }

    showToast(recapLines.join(" "), "info");
  };

  const handleDeleteStory = async (storyId) => {
    try {
      const res = await fetch(`${API_BASE}/stories/${storyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        if (selectedStoryId === storyId) {
          navigate('/app');
        }
        fetchStories();
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch {
      setError("Failed to delete story");
    }
  };

  const handleRenameStory = async (storyId, newName) => {
    try {
      const story = stories.find((s) => s.id === storyId);
      const res = await fetch(`${API_BASE}/stories/${storyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          genre: story?.genre || null,
        }),
      });

      if (res.ok) fetchStories();
      else if (res.status === 401) handleLogout();
    } catch {
      setError("Failed to rename story");
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError("");

    try {
      let storyId = selectedStoryId;

      // Create new story if none selected
      if (!storyId) {
        const createRes = await fetch(`${API_BASE}/stories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name:
              inputText.slice(0, 50) +
              (inputText.length > 50 ? "..." : ""),
            genre: genre,
          }),
        });

        if (!createRes.ok) throw new Error("Failed to create story");

        const newStory = await createRes.json();
        storyId = newStory.id;

        // Navigate to new story URL
        navigate(`/app/m/${newStory.hash_id}`);
        await fetchStories();
      }

      // Generate story response
      const generateRes = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          story_id: storyId,
          prompt: buildPromptWithConstraints(inputText),
          genre: genre,
        }),
      });

      if (!generateRes.ok) throw new Error("Failed to generate story");

      const result = await generateRes.json();

      if (result.request_id) {
        // It's a proposal
        setInputText("");
        setNewMessageId(null);
        // We could add a temporary message or just a toast
        showToast("Proposal sent to owner for approval!");
        return;
      }

      const newMessage = {
        id: result.message_id,
        user_prompt: inputText,
        ai_response: result.ai_response,
        hint_context: result.hint,
        stability_score: result.stability_score,
        order_index: messages.length,
      };

      setMessages((prev) => [...prev, newMessage]);
      setNewMessageId(result.message_id); // Trigger typing animation for this message
      setInputText("");
      fetchStories();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!inputText.trim() || !selectedStoryId) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/continue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          story_id: selectedStoryId,
          prompt: buildPromptWithConstraints(inputText),
        }),
      });

      if (!res.ok) throw new Error("Failed to continue story");

      const result = await res.json();

      if (result.request_id) {
        // It's a proposal
        setInputText("");
        setNewMessageId(null);
        showToast("Proposal sent to owner for approval!");
        return;
      }

      const newMessage = {
        id: result.message_id,
        user_prompt: inputText,
        ai_response: result.ai_response,
        hint_context: result.hint,
        stability_score: result.stability_score,
        order_index: messages.length,
      };

      setMessages((prev) => [...prev, newMessage]);
      setNewMessageId(result.message_id); // Trigger typing animation for this message
      setInputText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async (messageId, refinePrompt) => {
    if (!refinePrompt.trim()) return;

    setRefiningId(messageId);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/refine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message_id: messageId,
          refine_prompt: refinePrompt,
        }),
      });

      if (!res.ok) throw new Error("Failed to refine message");

      const result = await res.json();

      if (result.request_id) {
        showToast("Refinement proposal sent to owner for approval!");
        return;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
              ...m,
              ai_response: result.ai_response,
              hint_context: result.hint,
            }
            : m
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setRefiningId(null);
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    try {
      const res = await fetch(`${API_BASE}/messages/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newContent,
        }),
      });

      if (!res.ok) throw new Error("Failed to update message");

      const result = await res.json();

      if (result.request_id) {
        showToast("Edit proposal sent to owner for approval!");
        return;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, ai_response: result.ai_response }
            : m
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // ==================== Reaction & Review Handlers ====================

  const handleReaction = async (messageId, reactionType) => {
    try {
      const res = await fetch(`${API_BASE}/messages/${messageId}/reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reaction_type: reactionType }),
      });

      if (!res.ok) throw new Error("Failed to set reaction");

      const result = await res.json();

      setReactions((prev) => ({
        ...prev,
        [messageId]: {
          type: result.reaction_type,
          likes: result.likes,
          dislikes: result.dislikes,
        },
      }));
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  const handleAddReview = async (messageId, comment) => {
    try {
      const res = await fetch(`${API_BASE}/messages/${messageId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });

      if (!res.ok) throw new Error("Failed to add review");

      const newReview = await res.json();

      setReviews((prev) => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), newReview],
      }));
    } catch (err) {
      console.error("Add review error:", err);
    }
  };

  const handleDeleteReview = async (reviewId, messageId) => {
    try {
      const res = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete review");

      setReviews((prev) => ({
        ...prev,
        [messageId]: (prev[messageId] || []).filter((r) => r.id !== reviewId),
      }));
    } catch (err) {
      console.error("Delete review error:", err);
    }
  };

  // Fetch reactions and reviews when messages load
  const fetchReactionsAndReviews = async (messageIds) => {
    if (!token || messageIds.length === 0) return;

    try {
      // Fetch reactions and reviews for all messages
      const reactionsData = {};
      const reviewsData = {};

      await Promise.all(
        messageIds.map(async (messageId) => {
          try {
            const [reactionRes, reviewsRes] = await Promise.all([
              fetch(`${API_BASE}/messages/${messageId}/reaction`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              fetch(`${API_BASE}/messages/${messageId}/reviews`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);

            if (reactionRes.ok) {
              const reaction = await reactionRes.json();
              reactionsData[messageId] = {
                type: reaction.reaction_type,
                likes: reaction.likes,
                dislikes: reaction.dislikes,
              };
            }

            if (reviewsRes.ok) {
              reviewsData[messageId] = await reviewsRes.json();
            }
          } catch (err) {
            console.error(`Error fetching data for message ${messageId}:`, err);
          }
        })
      );

      setReactions((prev) => ({ ...prev, ...reactionsData }));
      setReviews((prev) => ({ ...prev, ...reviewsData }));
    } catch (err) {
      console.error("Error fetching reactions/reviews:", err);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Authenticated app content (Sidebar + Chat)
  const authenticatedAppContent = (
    <div className="flex h-screen w-full bg-black overflow-hidden">
      <Sidebar
        stories={stories}
        selectedStoryId={selectedStoryId}
        onSelectStory={handleSelectStory}
        onNewStory={handleNewStory}
        onDeleteStory={handleDeleteStory}
        onRenameStory={handleRenameStory}
        user={user}
        onLogout={handleLogout}
      />

      <ChatArea
        messages={messages}
        selectedStory={selectedStory}
        loading={loading}
        refiningId={refiningId}
        error={error}
        inputText={inputText}
        setInputText={setInputText}
        genre={genre}
        setGenre={setGenre}
        onSend={handleSendMessage}
        onContinue={handleContinue}
        onRefine={handleRefine}
        onEditMessage={handleEditMessage}
        hasMessages={messages.length > 0}
        newMessageId={newMessageId}
        reactions={reactions}
        reviews={reviews}
        onReaction={handleReaction}
        onAddReview={handleAddReview}
        onDeleteReview={handleDeleteReview}
        user={user}
        onRefresh={() => fetchMessages(selectedStoryId)}
        storyTools={getActiveStoryTools()}
        onUpdateStoryTools={updateActiveStoryTools}
        onExportStory={handleExportStory}
        onGenerateRecap={handleGenerateRecap}
      />
      <AccessRequestModal
        isOpen={showAccessModal}
        storyHash={accessStoryHash}
        token={token}
        isPending={isAccessPending}
        onRequestAccess={() => { }}
      />
    </div>
  );

  // Login page wrapper that redirects to app on success
  const LoginPage = () => {
    const navigate = useNavigate();

    const onSuccess = (userData, accessToken) => {
      handleLoginSuccess(userData, accessToken);
      navigate('/app');
    };

    return <Login onLoginSuccess={onSuccess} />;
  };

  return (
    <>
      <ScrollToTop />
      {!isAppRoute && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={user && token ? <Navigate to="/app" replace /> : <HomePage />}
        />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route
          path="/login"
          element={user && token ? <Navigate to="/app" replace /> : <LoginPage />}
        />

        {/* Protected route */}
        <Route
          path="/app"
          element={user && token ? authenticatedAppContent : <Navigate to="/login" replace />}
        />
        <Route
          path="/app/m/:hashId"
          element={user && token ? authenticatedAppContent : <Navigate to="/login" replace />}
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAppRoute && <Footer />}

      {/* Toast Notifications */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 items-center pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border border-blue-500/20 rounded-xl shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-top-4 duration-300 min-w-[300px]"
          >
            <div className="flex-shrink-0">
              {toast.type === 'success' && <CheckCircle size={18} className="text-blue-500" />}
              {toast.type === 'error' && <XCircle size={18} className="text-red-500" />}
              {toast.type === 'info' && <Info size={18} className="text-blue-400" />}
            </div>
            <p className="text-sm font-medium text-gray-200">{toast.message}</p>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="ml-auto text-gray-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
