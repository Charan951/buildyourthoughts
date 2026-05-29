import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";

const AdminResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!token) {
      setError("Invalid reset link.");
      return;
    }
    if (password.trim().length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to reset password.");
      setSuccess(data.message || "Password reset successfully.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/admin", { replace: true }), 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to reset password.");
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
          <p className="text-[11px] text-purple-600 font-bold uppercase tracking-widest mt-1">Reset Password</p>
        </div>

        <div className="text-center mb-5">
          <h2 className="text-lg font-bold text-gray-900">Set a new password</h2>
          <p className="text-xs text-gray-500 mt-0.5">Use the link from your email to reset your admin password.</p>
        </div>

        {error && <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">{error}</div>}
        {success && <div className="mb-4 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium text-center">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="reset-password" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">New password</label>
            <div className="relative">
              <input
                id="reset-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={8}
                maxLength={100}
                className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="reset-password-confirm" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Confirm password</label>
            <input
              id="reset-password-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              required
              minLength={8}
              maxLength={100}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-purple-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-purple-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting…" : "Reset password"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to="/admin" className="text-purple-600 hover:underline">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;
