import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import logoEmbalsoft from "@/assets/logo-embalsoft.png";
import OrbitalBackground from "@/components/OrbitalBackground";

const EcosystemOrbits = () => {
  return (
    <div className="relative w-full aspect-square flex items-center justify-center min-h-[350px]">
      {/* Center Core */}
      <div className="absolute w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center glow-primary border border-primary/20 z-10">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_15px_#27ABE2]" />
      </div>

      {/* Orbit 1: WMS (#38b6ff) */}
      <div className="absolute w-[140px] h-[140px] rounded-full border border-[#38b6ff]/20">
        <div className="w-full h-full animate-[spin_12s_linear_infinite]">
          <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#38b6ff] shadow-[0_0_8px_#38b6ff]" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 text-[#38b6ff] text-[10px] font-semibold tracking-wider bg-background/80 backdrop-blur-md rounded border border-[#38b6ff]/30">
          WMS
        </div>
      </div>

      {/* Orbit 2: CRM (#a7c64f) */}
      <div className="absolute w-[220px] h-[220px] rounded-full border border-[#a7c64f]/20">
        <div className="w-full h-full animate-[spin_20s_linear_infinite]" style={{ animationDirection: 'reverse' }}>
          <div className="absolute top-1/2 right-0 w-2 h-2 -mt-1 -mr-1 rounded-full bg-[#a7c64f] shadow-[0_0_8px_#a7c64f]" />
        </div>
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 px-2 py-0.5 text-[#a7c64f] text-[10px] font-semibold tracking-wider bg-background/80 backdrop-blur-md rounded border border-[#a7c64f]/30">
          CRM
        </div>
      </div>

      {/* Orbit 3: ERP (#f48121) */}
      <div className="absolute w-[300px] h-[300px] rounded-full border border-[#f48121]/20">
        <div className="w-full h-full animate-[spin_30s_linear_infinite]">
          <div className="absolute bottom-0 left-1/2 w-2 h-2 -ml-1 -mb-1 rounded-full bg-[#f48121] shadow-[0_0_8px_#f48121]" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-2 py-0.5 text-[#f48121] text-[10px] font-semibold tracking-wider bg-background/80 backdrop-blur-md rounded border border-[#f48121]/30">
          ERP
        </div>
      </div>
    </div>
  );
};

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
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Orbital animated background */}
      <OrbitalBackground />

      {/* Login Card (Split Format) */}
      <div className="relative z-10 w-full max-w-[900px] mx-4 animate-fade-in-up">
        <div className="glass rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/5">
          
          {/* Lado Esquerdo - Formulário */}
          <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
            {/* Logo */}
            <div className="flex justify-center mb-8 animate-fade-in-up-delay-1">
              <img src={logoEmbalsoft} alt="Embalsoft" className="h-12 object-contain" />
            </div>

            {/* Title */}
            <div className="text-center mb-8 animate-fade-in-up-delay-2">
              <h1 className="text-2xl font-bold tracking-tight mb-2">
                Bem-vindo ao<br />
                <span className="text-primary">Universo Embalsoft</span>
              </h1>
              <p className="text-muted-foreground text-sm">
                Acompanhe. Entenda. Evolua.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up-delay-3 max-w-sm mx-auto w-full">
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
                  className={`w-full px-4 py-3 rounded-lg bg-[hsl(217,33%,17%)]/50 border text-foreground placeholder:text-muted-foreground/50 text-sm transition-all duration-200 outline-none
                    ${touched.email && !email ? "border-destructive" : "border-border/50"}
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
                    className={`w-full px-4 py-3 pr-12 rounded-lg bg-[hsl(217,33%,17%)]/50 border text-foreground placeholder:text-muted-foreground/50 text-sm transition-all duration-200 outline-none
                      ${touched.password && !password ? "border-destructive" : "border-border/50"}
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
                className="w-full py-3 rounded-lg gradient-primary font-semibold text-sm text-primary-foreground transition-all duration-300 hover:gradient-primary-hover hover:glow-primary-strong hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
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
              <div className="text-center animate-fade-in-up-delay-4 pt-2">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            </form>
          </div>

          {/* Lado Direito - Ecossistema */}
          <div className="hidden md:flex w-[40%] bg-black/40 border-l border-white/5 p-8 items-center justify-center relative overflow-hidden">
            <EcosystemOrbits />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
