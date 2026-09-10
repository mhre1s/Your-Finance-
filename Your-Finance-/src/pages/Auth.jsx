import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { authService, healthService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, Wallet, Sun, Moon, ArrowLeft, KeyRound, Eye, EyeOff } from 'lucide-react';

/**
 * Indicador de Cold Start de alta fidelidade visual.
 * Exibido quando a instância gratuita do Render está em processo de despertar (>2.5s).
 */
const ColdStartBanner = ({ stage }) => {
  const stageMessages = {
    1: 'Conectando ao servidor em nuvem...',
    2: 'Inicializando serviços e banco de dados...',
    3: 'Quase pronto! Concluindo autenticação...',
  };

  const progressWidth = stage === 1 ? '35%' : stage === 2 ? '70%' : '92%';

  return (
    <div className="mt-3.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 transition-all duration-300">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            {stageMessages[stage] || stageMessages[1]}
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/40">
          Iniciando
        </span>
      </div>

      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-2.5">
        A infraestrutura gratuita em nuvem hiberna após períodos sem uso e leva cerca de 30 a 45 segundos para reativar. Sua sessão será aberta em instantes.
      </p>

      <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: progressWidth }}
        />
      </div>
    </div>
  );
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Controle de visibilidade das senhas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [warmupStage, setWarmupStage] = useState(0);

  const { login, register, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Wake-up proativo: acorda o Render em segundo plano enquanto o usuário interage
  useEffect(() => {
    healthService.ping();
  }, []);

  // Monitora cold start (> 2.5s) com estágios progressivos para feedback em tempo real
  const isRequestInProgress = submitting || forgotLoading;
  useEffect(() => {
    let timer1;
    let timer2;
    let timer3;

    if (isRequestInProgress) {
      timer1 = setTimeout(() => {
        setIsWarmingUp(true);
        setWarmupStage(1);
      }, 2500);

      timer2 = setTimeout(() => {
        setWarmupStage(2);
      }, 14000);

      timer3 = setTimeout(() => {
        setWarmupStage(3);
      }, 28000);
    } else {
      setIsWarmingUp(false);
      setWarmupStage(0);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isRequestInProgress]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
        setSuccess('Conta criada com sucesso! Redirecionando...');
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setForgotSuccess('');

    if (!forgotEmail) {
      setError('Por favor, informe o seu e-mail.');
      return;
    }

    setForgotLoading(true);
    try {
      const response = await authService.forgotPassword(forgotEmail);
      setForgotSuccess(response.message || 'Se este e-mail estiver cadastrado, você receberá um link em instantes.');
      toast.info('Instruções enviadas', 'Verifique sua caixa de entrada para redefinir a senha.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar recuperação.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12 transition-colors relative text-zinc-900 dark:text-zinc-100">
      {/* Alternador de Tema */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 shadow-xs transition-colors cursor-pointer"
          aria-label="Alternar tema"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-amber-400" />}
        </button>
      </div>

      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs mx-auto mb-3">
            <Wallet size={20} strokeWidth={2.2} />
          </div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Your Finances
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Gestão financeira pessoal simples, segura e eficiente
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-7 shadow-xs border border-zinc-200/80 dark:border-zinc-800/80">
          {showForgotPassword ? (
            /* =================== VIEW: ESQUECI MINHA SENHA =================== */
            <div>
              <div className="text-center mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <KeyRound size={20} />
                </div>
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Recuperar Senha
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Digite seu e-mail para receber as instruções de redefinição
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {forgotSuccess ? (
                <div className="space-y-4 text-center">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs flex items-start gap-2.5 text-left">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    <span>{forgotSuccess}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotSuccess('');
                      setError('');
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    Voltar para o Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      E-mail cadastrado
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 text-zinc-400 pointer-events-none">
                        <Mail size={15} />
                      </div>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="nome@exemplo.com"
                        className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {forgotLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Enviar link de recuperação</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>

                  {isWarmingUp && forgotLoading && <ColdStartBanner stage={warmupStage} />}

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setError('');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                    >
                      <ArrowLeft size={13} />
                      <span>Voltar para o login</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* =================== VIEW: LOGIN / CADASTRO =================== */
            <>
              {/* Seletor Entrar / Cadastrar */}
              <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800/70 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isLogin
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Acessar conta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    !isLogin
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Criar conta
                </button>
              </div>

              {/* Mensagens de Status */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Nome completo
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 text-zinc-400 pointer-events-none">
                        <User size={15} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    E-mail
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-zinc-400 pointer-events-none">
                      <Mail size={15} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="nome@exemplo.com"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Senha
                    </label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setForgotEmail(formData.email);
                          setError('');
                        }}
                        className="text-[11px] text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        Esqueceu a senha?
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-zinc-400 pointer-events-none">
                      <Lock size={15} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer p-0.5"
                      aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Confirmar senha
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 text-zinc-400 pointer-events-none">
                        <Lock size={15} />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer p-0.5"
                        aria-label={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Exibir confirmação de senha'}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{isLogin ? 'Entrar' : 'Concluir cadastro'}</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>

                  {isWarmingUp && submitting && <ColdStartBanner stage={warmupStage} />}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
