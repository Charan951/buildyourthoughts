import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const AdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email.trim()) {
      setError("Please enter your admin email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset email.");
      setSuccess(data.message || "If that email exists, a reset link has been sent.");
      setEmail("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page min-h-screen flex items-center justify-center bg-[#1e1b2e] p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 rounded-full bg-purple-700/20 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-72 h-72 rounded-full bg-purple-500/15 blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6" style={{ colorScheme: "light" }}>
        <div className="flex flex-col items-center text-center mb-5">
          <img src="/logo.png" alt="BUILD YOUR THOUGHTS" className="w-16 h-16 object-contain mb-3" />
          <h1 className="font-bold text-base uppercase tracking-wide text-gray-900 leading-tight">BUILD YOUR THOUGHTS</h1>
          <p className="text-[11px] text-purple-600 font-bold uppercase tracking-widest mt-1">Admin Password Reset</p>
        </div>

        <div className="text-center mb-5">
          <h2 className="text-lg font-bold text-gray-900">Forgot your password?</h2>
          <p className="text-xs text-gray-500 mt-0.5">Enter your admin email to receive a reset link.</p>
        </div>

        {error && <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">{error}</div>}
        {success && <div className="mb-4 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium text-center">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="forgot-email" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourcompany.com"
                required
                maxLength={100}
                autoComplete="email"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-purple-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-purple-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to="/admin" className="text-purple-600 hover:underline">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
