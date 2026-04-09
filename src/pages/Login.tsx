import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import bgLogin from "@/assets/bg-login.png";
import logoEmbalsoft from "@/assets/logo-embalsoft.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    if (!validateEmail(email)) {
      setError("E-mail inválido.");
      return;
    }

    setLoading(true);
    // Simulate auth
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={bgLogin} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in-up">
        <div className="glass rounded-2xl p-8 md:p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-fade-in-up-delay-1">
            <img src={logoEmbalsoft} alt="Embalsoft" className="h-10 object-contain" />
          </div>

          {/* Title */}
          <div className="text-center mb-8 animate-fade-in-up-delay-2">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Bem-vindo ao <span className="text-primary">Embalsoft Analytics</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Acompanhe. Entenda. Evolua.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up-delay-3">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                className={`w-full px-4 py-3 rounded-lg bg-secondary/50 border text-foreground placeholder:text-muted-foreground/50 text-sm transition-all duration-200 outline-none
                  ${touched.email && !email ? "border-destructive" : "border-border"}
                  focus:border-primary focus:glow-primary`}
              />
              {touched.email && !email && (
                <p className="text-xs text-destructive">Campo obrigatório</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground" htmlFor="password">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                  className={`w-full px-4 py-3 pr-12 rounded-lg bg-secondary/50 border text-foreground placeholder:text-muted-foreground/50 text-sm transition-all duration-200 outline-none
                    ${touched.password && !password ? "border-destructive" : "border-border"}
                    focus:border-primary focus:glow-primary`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.password && !password && (
                <p className="text-xs text-destructive">Campo obrigatório</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 animate-fade-in">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg gradient-primary font-semibold text-sm text-primary-foreground transition-all duration-300 hover:gradient-primary-hover hover:glow-primary-strong hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>

            {/* Forgot */}
            <div className="text-center animate-fade-in-up-delay-4">
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
