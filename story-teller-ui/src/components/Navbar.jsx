import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import mythos from '/logo/mythos-2.png';
export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-1.5 bg-transparent">
      <div className="flex items-center gap-2">
        <img src={mythos} alt="Mythos" className="w-32 h-32" />
      </div>

      <div className="flex items-center gap-1 bg-[#0f0f1f]/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2">
        <Link
          to="/"
          className="text-gray-300 hover:text-white transition px-4 py-2 text-sm rounded-full"
        >
          Home
        </Link>
        <Link
          to="/docs"
          className="text-gray-300 hover:text-white transition px-4 py-2 text-sm rounded-full"
        >
          Docs
        </Link>
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 text-sm bg-white text-black rounded-full hover:bg-gray-100 transition ml-2"
        >
          Login
        </button>
      </div>
    </nav>
  );
}
