import os
import re
<<<<<<< HEAD
from typing import Dict, List, Optional

from dotenv import load_dotenv
from groq import Groq
=======
from groq import Groq
from dotenv import load_dotenv
>>>>>>> 06c1e598b6d2e1ebaeb2085388124ae89f2cadae

load_dotenv(override=True)

client = Groq(api_key=os.getenv("LLM_API_KEY"))


<<<<<<< HEAD
_NAME_STOPWORDS = {
    "The", "A", "An", "And", "But", "Or", "If", "Then", "When", "While", "After",
    "Before", "Because", "However", "Meanwhile", "He", "She", "They", "It", "We", "I",
    "You", "His", "Her", "Their", "Our", "My", "Your", "In", "On", "At", "From",
    "To", "Into", "Out", "Of", "For", "With", "Without", "By", "As", "Is", "Was",
    "Were", "Be", "Being", "Been", "This", "That", "These", "Those", "Chapter", "Scene",
}

_SCIENCE_KEYWORDS = {
    "science", "scientific", "physics", "chemistry", "biology", "astronomy", "space", "orbit",
    "vacuum", "gravity", "radiation", "reactor", "quantum", "engine", "lab", "experiment",
    "spaceship", "oxygen", "pressure", "temperature", "equation", "scientist", "hard sci-fi",
    "hard sci fi", "realistic science", "realism",
}


def _parse_story_constraints(context: str) -> tuple[dict, str]:
    """Parse optional STORY_CONSTRAINTS block embedded in user prompt."""
    defaults = {
        "strictness_mode": "strict_canon",
        "max_words": None,
        "no_new_characters": False,
        "science_strict": False,
    }

    if not context:
        return defaults, context

    block_match = re.search(r"\[STORY_CONSTRAINTS\](.*?)\[/STORY_CONSTRAINTS\]", context, flags=re.DOTALL)
    if not block_match:
        return defaults, context

    block = block_match.group(1)

    strictness_match = re.search(r"STRICTNESS_MODE\s*=\s*([a-zA-Z_]+)", block)
    if strictness_match:
        defaults["strictness_mode"] = strictness_match.group(1).strip().lower()

    max_words_match = re.search(r"MAX_WORDS\s*=\s*(\d+)", block)
    if max_words_match:
        defaults["max_words"] = int(max_words_match.group(1))

    no_new_match = re.search(r"NO_NEW_CHARACTERS\s*=\s*(true|false)", block, flags=re.IGNORECASE)
    if no_new_match:
        defaults["no_new_characters"] = no_new_match.group(1).lower() == "true"

    sci_match = re.search(r"SCIENCE_STRICT\s*=\s*(true|false)", block, flags=re.IGNORECASE)
    if sci_match:
        defaults["science_strict"] = sci_match.group(1).lower() == "true"

    cleaned_context = re.sub(r"\[STORY_CONSTRAINTS\].*?\[/STORY_CONSTRAINTS\]\s*", "", context, flags=re.DOTALL).strip()
    return defaults, cleaned_context


def _normalize_active_genre(genre: str, context: str) -> str:
    """Normalize genre and force scientific mode when prompt requests it."""
    genre_lower = (genre or "").strip().lower()
    context_lower = (context or "").lower()
    combined = f"{genre_lower} {context_lower}"

    if any(k in combined for k in _SCIENCE_KEYWORDS):
        return "HARD_SCI_FI"
    if "soft sci" in combined:
        return "SOFT_SCI_FI"
    if "sci" in combined:
        return "HARD_SCI_FI"
    if "fantasy" in combined:
        return "FANTASY"
    if "horror" in combined:
        return "HORROR"
    return (genre or "GENERAL").upper().replace(" ", "_")


def _extract_character_registry(history: Optional[List[Dict]], summary: Optional[str]) -> List[str]:
    """Extract probable character names from history + summary for continuity locking."""
    text_parts: List[str] = []
    for item in history or []:
        content = item.get("content")
        if content:
            text_parts.append(content)
    if summary:
        text_parts.append(summary)

    joined = "\n".join(text_parts)

    multi_word = re.findall(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b", joined)
    single_word = re.findall(r"\b([A-Z][a-z]{2,})\b", joined)

    ranked: List[str] = []
    seen = set()

    for name in multi_word + single_word:
        cleaned = name.strip()
        if cleaned in _NAME_STOPWORDS:
            continue
        if len(cleaned) < 3:
            continue
        if cleaned not in seen:
            seen.add(cleaned)
            ranked.append(cleaned)

    return ranked[:16]


def _build_canon_guardrails(
    history: Optional[List[Dict]],
    summary: Optional[str],
    world_rules: Optional[str],
    user_instruction: str,
) -> str:
    """Build hard continuity constraints injected as system guidance."""
    locked_characters = _extract_character_registry(history, summary)
    char_block = ", ".join(locked_characters) if locked_characters else "None yet"

    return (
        "NON-NEGOTIABLE CONTINUITY RULES:\n"
        "1. Follow the user's latest instruction exactly.\n"
        "2. Preserve character identity: never rename existing characters.\n"
        "3. Keep character roster stable unless user explicitly asks for additions/removals.\n"
        "4. Do not erase established characters or facts.\n"
        "5. Continue directly from previous scene with causal continuity.\n"
        "6. Reuse established locations, technology, and world-state constraints.\n"
        "7. In canon conflicts, previous established facts win unless user explicitly retcons.\n"
        "8. In HARD_SCI_FI/REALISM, obey real science and physical constraints strictly.\n"
        "9. Do not output impossible scientific events as factual outcomes.\n"
        "10. Keep the response focused on what user asked in this turn.\n\n"
        f"LOCKED_CHARACTERS: {char_block}\n"
        f"USER_INTENT_TO_FOLLOW: {user_instruction}\n"
        f"CURRENT_WORLD_RULES: {world_rules or 'No world rules yet.'}\n"
    )


def generate_story(
    context: str,
    genre: str = "",
    history: Optional[List[Dict]] = None,
    summary: Optional[str] = None,
    retrieved_hints: Optional[List[str]] = None,
    previous_nsi: int = 100,
    world_rules: Optional[str] = None,
    temperature: float = 0.55,
    max_tokens: int = 1200,
):
    """
    Generate a story continuation with strict continuity and science enforcement.
    Returns (clean_text, violations, updated_rules).
    """
    constraints, clean_context = _parse_story_constraints(context)
    strictness_mode = constraints["strictness_mode"]

    genre_str = f" in the {genre} genre" if genre else ""
    active_genre = _normalize_active_genre(genre, clean_context)
    if constraints["science_strict"] or strictness_mode == "hard_science":
        active_genre = "HARD_SCI_FI"

    if strictness_mode == "balanced":
        temperature = max(0.5, temperature)
    else:
        temperature = min(temperature, 0.45)

    rules_context = world_rules or summary or "No established world rules yet."
    hint_rag = "\n".join([f"- {h}" for h in (retrieved_hints or [])]) or "No previous hints."
    canon_guardrails = _build_canon_guardrails(history, summary, rules_context, clean_context)

    max_words_instruction = ""
    if constraints["max_words"]:
        max_words_instruction = f"- Keep the response under {constraints['max_words']} words.\\n"

    no_new_characters_instruction = ""
    if constraints["no_new_characters"]:
        no_new_characters_instruction = "- Do not introduce new named characters in this turn.\\n"

    system_prompt = (
        "[STRICT_CANON_EXECUTION_BLOCK]\n\n"
        "OBJECTIVE:\n"
        "Maintain persistent world consistency across turns according to ACTIVE_GENRE.\n"
        "Preserve narrative stability and avoid hallucinated contradictions.\n\n"
=======
def generate_story(
    context: str, 
    genre: str = "", 
    history: list = None, 
    summary: str = None,
    retrieved_hints: list = None,
    previous_nsi: int = 100,
    world_rules: str = None,
    temperature: float = 0.85, 
    max_tokens: int = 1200
) -> str:
    """
    Generate a story continuation using genre-adaptive world consistency engine.
    Returns (clean_text, violations, updated_rules).
    """

    genre_str = f" in the {genre} genre" if genre else ""
    active_genre = (genre or "general").upper().replace(" ", "_")

    # Build world rules context (dedicated column > summary fallback)
    rules_context = world_rules or summary or "No established world rules yet."
    # Build hint RAG context
    hint_rag = "\n".join([f"- {h}" for h in (retrieved_hints or [])]) or "No previous hints."

    # 🔥 Genre-Adaptive World Consistency Engine
    system_prompt = (
        "[ANTIGRAVITY_EXECUTION_BLOCK]\n\n"
        "OBJECTIVE:\n"
        "Maintain persistent world consistency across turns according to ACTIVE_GENRE.\n"
        "Preserve narrative stability.\n"
        "Prevent contradictions.\n\n"

>>>>>>> 06c1e598b6d2e1ebaeb2085388124ae89f2cadae
        "--------------------------------\n"
        f"ACTIVE_GENRE: {active_genre}\n"
        f"EXISTING_WORLD_RULES: {rules_context}\n"
        f"PREVIOUS_WORLD_HINTS:\n{hint_rag}\n"
        f"PREVIOUS_NSI_SCORE: {previous_nsi}\n"
        "--------------------------------\n\n"
<<<<<<< HEAD
        f"{canon_guardrails}\n"
        "MANDATORY SCIENCE ENFORCEMENT:\n"
        "- If ACTIVE_GENRE is HARD_SCI_FI or REALISM: physics, biology, chemistry, and engineering must be plausible.\n"
        "- No impossible survival, travel, medicine, or devices without prior setup and explanation.\n\n"
        "MANDATORY CHARACTER ENFORCEMENT:\n"
        "- Keep names consistent across turns.\n"
        "- Do not silently replace or rename characters.\n"
        "- Keep role continuity and relationships coherent.\n\n"
        "NSI VIOLATION DETECTION (INTERNAL):\n"
        "Use only these categories with integer counts:\n"
        "1. CHARACTER_INCONSISTENCY\n"
        "2. TIMELINE_CONTRADICTION\n"
        "3. WORLD_RULE_VIOLATION\n"
        "4. IGNORED_FACT\n\n"
        "OUTPUT RULES:\n"
        "- Output only the next immediate scene in plain immersive prose.\n"
        "- Follow USER_INTENT_TO_FOLLOW strictly.\n"
        f"{max_words_instruction}"
        f"{no_new_characters_instruction}"
        "- Append metadata block at end:\n"
=======

        "INTERNAL EXECUTION (DO NOT OUTPUT):\n\n"
        "1. Extract constraints from:\n"
        "   - EXISTING_WORLD_RULES\n"
        "   - PREVIOUS_WORLD_HINTS\n"
        "   - Current user input\n\n"

        "2. Merge into WORLD_RULE_SET.\n"
        "   - Never remove prior constraints unless explicitly changed in-story.\n"
        "   - Preserve environmental, physical, magical, technological, biological rules.\n\n"

        "3. Apply GENRE_ADAPTIVE_ENFORCEMENT:\n\n"

        "   HARD_SCI_FI:\n"
        "     - Real-world physics strictly enforced.\n"
        "     - No survival in vacuum without protection.\n"
        "     - Combustion requires oxygen.\n"
        "     - Radiation, gravity, pressure obey science.\n\n"

        "   SOFT_SCI_FI:\n"
        "     - Plausible science.\n"
        "     - Speculative tech must remain internally consistent.\n\n"

        "   FANTASY:\n"
        "     - Real-world physics irrelevant unless previously established.\n"
        "     - Magical systems must remain consistent.\n"
        "     - Power limitations persist.\n\n"

        "   HORROR:\n"
        "     - Maintain environmental continuity.\n"
        "     - Supernatural elements must follow introduced logic.\n\n"

        "   REALISM:\n"
        "     - Real-world logic strictly enforced.\n\n"

        "4. If new input contradicts WORLD_RULE_SET:\n"
        "     - Adjust narrative logically.\n"
        "     - Prevent impossible survival or contradictions.\n"
        "     - Preserve immersion.\n\n"

        "5. Update WORLD_RULE_SET with validated new constraints.\n\n"

        "ADAPTIVE STABILIZATION:\n"
        f"If PREVIOUS_NSI_SCORE ({previous_nsi}) < 80:\n"
        "  - Prioritize continuity stabilization.\n"
        "  - Avoid introducing new plot branches.\n"
        "  - Reinforce established constraints.\n\n"

        "--------------------------------\n"
        "SCORING (INTERNAL CALCULATION):\n"
        "--------------------------------\n\n"

        "NSI VIOLATION DETECTION (STATIC — DO NOT MODIFY RULES):\n\n"
        "Detect violations using ONLY the following categories:\n"
        "Detection must be conservative and evidence-based.\n"
        "Do not assume violations unless clearly present.\n\n"
        "1. CHARACTER_INCONSISTENCY\n"
        "   - Personality shifts without cause\n"
        "   - Skill changes without explanation\n"
        "   - Motivation contradictions\n\n"
        "2. TIMELINE_CONTRADICTION\n"
        "   - Events occurring in impossible order\n"
        "   - Time skips without acknowledgment\n"
        "   - Logical sequence breaks\n\n"
        "3. WORLD_RULE_VIOLATION\n"
        "   - Breaking established environmental, physical, magical, or technological constraints\n\n"
        "4. IGNORED_FACT\n"
        "   - Previously established facts not respected\n\n"

        "--------------------------------\n"
        "OUTPUT RULES:\n"
        "--------------------------------\n"
        "- Output immersive plain text story only.\n"
        "- Append hidden metadata block at the very end:\n\n"
>>>>>>> 06c1e598b6d2e1ebaeb2085388124ae89f2cadae
        "<WRLD>\n"
        "UPDATED_RULES: ...\n"
        "VIOLATION_COUNTS:\n"
        "  CHARACTER_INCONSISTENCY: <int>\n"
        "  TIMELINE_CONTRADICTION: <int>\n"
        "  WORLD_RULE_VIOLATION: <int>\n"
        "  IGNORED_FACT: <int>\n"
<<<<<<< HEAD
        "</WRLD>\n"
=======
        "</WRLD>\n\n"

        "Rules for VIOLATION_COUNTS:\n"
        "- Output only integer counts.\n"
        "- If no violations, output 0.\n"
        "- Do NOT calculate NSI score.\n"
        "- Do NOT invent new categories.\n"
        "- Do NOT explain reasoning.\n"
>>>>>>> 06c1e598b6d2e1ebaeb2085388124ae89f2cadae
    )

    messages = [{"role": "system", "content": system_prompt}]

    if summary:
<<<<<<< HEAD
        messages.append(
            {
                "role": "system",
                "content": f"=== STORY CANON SUMMARY ===\n{summary}\n=== END SUMMARY ===",
            }
        )

    if retrieved_hints:
        hint_block = "\n".join([f"- {h}" for h in retrieved_hints])
        messages.append(
            {
                "role": "system",
                "content": f"=== KEY STORY MEMORY NOTES ===\n{hint_block}\n=== END NOTES ===",
            }
        )
=======
        messages.append({
            "role": "system",
            "content": f"=== STORY CANON SUMMARY ===\n{summary}\n=== END SUMMARY ==="
        })

    if retrieved_hints and len(retrieved_hints) > 0:
        hint_block = "\n".join([f"- {h}" for h in retrieved_hints])
        messages.append({
            "role": "system",
            "content": f"=== KEY STORY MEMORY NOTES ===\n{hint_block}\n=== END NOTES ==="
        })
>>>>>>> 06c1e598b6d2e1ebaeb2085388124ae89f2cadae

    if history:
        messages.extend(history)

    current_prompt = (
        f"Continue the story{genre_str}.\n\n"
<<<<<<< HEAD
        f"Scene instruction:\n{clean_context}\n\n"
        "Write only the next immediate scene with strict continuity."
    )
=======
        f"Scene instruction:\n{context}\n\n"
        "Write the next scene in immersive prose."
    )

>>>>>>> 06c1e598b6d2e1ebaeb2085388124ae89f2cadae
    messages.append({"role": "user", "content": current_prompt})

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        temperature=temperature,
<<<<<<< HEAD
        max_tokens=max_tokens,
    )

    raw_output = response.choices[0].message.content.strip()
    violations = parse_wrld_violations(raw_output)
    updated_rules = extract_updated_rules(raw_output)
=======
        max_tokens=max_tokens
    )

    raw_output = response.choices[0].message.content.strip()

    # Parse violations from <WRLD> block before stripping
    violations = parse_wrld_violations(raw_output)
    # Extract updated world rules for persistence
    updated_rules = extract_updated_rules(raw_output)

    # Strip <WRLD> metadata block so it doesn't appear in UI
>>>>>>> 06c1e598b6d2e1ebaeb2085388124ae89f2cadae
    clean_output = re.sub(r"<WRLD>.*?</WRLD>", "", raw_output, flags=re.DOTALL).strip()

    return clean_output, violations, updated_rules


<<<<<<< HEAD
def generate_summary(history: List[Dict], current_summary: str = None) -> str:
    """Generate or update a rolling summary of the story context."""
    history_text = "\n".join([f"{m['role'].upper()}: {m['content']}" for m in history])

    system_prompt = (
        "You are a strict narrative summarizer. Summarize only provided facts.\n"
        "No hallucinations. Keep under 300 words. Preserve names, roles, and key constraints."
    )

    user_prompt = "Update the story summary with these events:\n\n"
    if current_summary:
        user_prompt += f"CURRENT SUMMARY: {current_summary}\n\n"
    user_prompt += f"NEW EVENTS:\n{history_text}\n\nReturn one factual paragraph."
=======
def generate_summary(history: list, current_summary: str = None) -> str:
    """
    Generate or update a rolling summary of the story context.
    """
    history_text = "\n".join([f"{m['role'].upper()}: {m['content']}" for m in history])
    
    system_prompt = (
        "You are a narrative summarizer. Create a concise, high-density summary "
        "of the story so far. Focus on characters, locations, and key events.\n\n"
        "STRICT RULES:\n"
        "1. No Hallucinations: Do NOT introduce new facts, characters, or plot points. Only summarize provided content.\n"
        "2. Conciseness: Keep the total summary under 300 words.\n"
        "3. Focus: Prioritize plot-critical transitions and character state changes."
    )
    
    user_prompt = f"Update the following story summary with these new events:\n\n"
    if current_summary:
        user_prompt += f"CURRENT SUMMARY: {current_summary}\n\n"
    user_prompt += f"NEW EVENTS:\n{history_text}\n\nWrite a single cohesive, factual paragraph summary."
>>>>>>> 06c1e598b6d2e1ebaeb2085388124ae89f2cadae

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
<<<<<<< HEAD
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
        max_tokens=500,
    )

    return response.choices[0].message.content.strip()


def parse_wrld_violations(raw_output: str) -> Dict[str, int]:
    """Extract violation counts from the <WRLD> metadata block."""
=======
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.3, # Low temperature for factual summarization
        max_tokens=600
    )
    
    return response.choices[0].message.content.strip()


def parse_wrld_violations(raw_output: str) -> dict:
    """
    Extract violation counts from the <WRLD> metadata block.
    Returns a dict with integer counts for each violation category.
    """
>>>>>>> 06c1e598b6d2e1ebaeb2085388124ae89f2cadae
    violations = {
        "CHARACTER_INCONSISTENCY": 0,
        "TIMELINE_CONTRADICTION": 0,
        "WORLD_RULE_VIOLATION": 0,
<<<<<<< HEAD
        "IGNORED_FACT": 0,
=======
        "IGNORED_FACT": 0
>>>>>>> 06c1e598b6d2e1ebaeb2085388124ae89f2cadae
    }

    wrld_match = re.search(r"<WRLD>(.*?)</WRLD>", raw_output, flags=re.DOTALL)
    if not wrld_match:
        return violations

    wrld_block = wrld_match.group(1)

    for key in violations:
        match = re.search(rf"{key}\s*:\s*(\d+)", wrld_block)
        if match:
            violations[key] = int(match.group(1))

    return violations


<<<<<<< HEAD
def compute_nsi(violations: Dict[str, int]) -> int:
    """Deterministic Narrative Stability Index calculation."""
=======
def compute_nsi(violations: dict) -> int:
    """
    Deterministic Narrative Stability Index calculation.
    LLM detects violations, backend computes score.
    """
>>>>>>> 06c1e598b6d2e1ebaeb2085388124ae89f2cadae
    score = 100
    score -= violations.get("CHARACTER_INCONSISTENCY", 0) * 10
    score -= violations.get("TIMELINE_CONTRADICTION", 0) * 10
    score -= violations.get("WORLD_RULE_VIOLATION", 0) * 15
    score -= violations.get("IGNORED_FACT", 0) * 5
    return max(score, 0)


def extract_updated_rules(raw_output: str) -> str:
<<<<<<< HEAD
    """Extract UPDATED_RULES from the <WRLD> metadata block."""
=======
    """
    Extract UPDATED_RULES from the <WRLD> metadata block.
    Returns the rules string, or empty string if not found.
    """
>>>>>>> 06c1e598b6d2e1ebaeb2085388124ae89f2cadae
    wrld_match = re.search(r"<WRLD>(.*?)</WRLD>", raw_output, flags=re.DOTALL)
    if not wrld_match:
        return ""

    wrld_block = wrld_match.group(1)
<<<<<<< HEAD
    match = re.search(
        r"UPDATED_RULES\s*:\s*(.*?)(?=VIOLATION_COUNTS\s*:)",
        wrld_block,
        flags=re.DOTALL,
    )
=======
    match = re.search(r"UPDATED_RULES\s*:\s*(.*?)(?=VIOLATION_COUNTS\s*:)", wrld_block, flags=re.DOTALL)
>>>>>>> 06c1e598b6d2e1ebaeb2085388124ae89f2cadae
    return match.group(1).strip() if match else ""
