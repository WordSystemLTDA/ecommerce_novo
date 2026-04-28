import React, { useState } from 'react'
import { FiEye, FiEyeOff, FiLock, FiMail, FiUserPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router'
import Button from '~/components/button'
import Footer from '~/components/footer'
import Header from '~/components/header'
import CustomInput from '~/components/input'
import { useAuth } from './context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { login } = useAuth();
  let navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login({ email, senha: password });
      navigate("/");
    } catch (error) {
      const apiMessage =
        (error as any)?.response?.data?.mensagem ||
        (error as any)?.response?.data?.message;

      setErrorMessage(apiMessage ?? 'Nao foi possivel entrar com os dados informados. Tente novamente.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-main-bg">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Login */}
            <div className="rounded-2xl border border-slate-100 bg-white/70 backdrop-blur-sm shadow-[0_4px_24px_rgba(15,23,42,0.05)] p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary">
                  <FiLock size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary/50 font-medium">Bem-vindo de volta</p>
                  <h2 className="font-serif text-xl font-semibold text-slate-800">Acessar conta</h2>
                </div>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-6 flex-1">
                {errorMessage && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wider text-primary/60 font-medium flex items-center gap-1.5">
                    <FiMail size={12} /> E-mail
                  </label>
                  <CustomInput
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wider text-primary/60 font-medium flex items-center gap-1.5">
                    <FiLock size={12} /> Senha
                  </label>
                  <PasswordInput
                    placeholder="Sua senha"
                    show={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-primary/30 accent-primary"
                    />
                    Lembrar meus dados
                  </label>
                  <a href="#" className="text-xs text-primary/60 hover:text-primary transition-colors">
                    Esqueci minha senha
                  </a>
                </div>

                <div className="mt-auto pt-2">
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'ACESSANDO...' : 'ACESSAR CONTA'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Cadastro */}
            <div className="rounded-2xl border border-slate-100 bg-white/70 backdrop-blur-sm shadow-[0_4px_24px_rgba(15,23,42,0.05)] p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--dynamic-success) bg-(--dynamic-success-bg) text-(--dynamic-success)">
                  <FiUserPlus size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">Primeira vez aqui?</p>
                  <h2 className="font-serif text-xl font-semibold text-slate-800">Criar conta</h2>
                </div>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                Crie sua conta e aproveite todos os benefícios: histórico de pedidos, endereços salvos, lista de favoritos e muito mais.
              </p>

              <div className="mt-auto">
                <Button variant="secondary" type="button" onClick={() => navigate("/registrar/")}>
                  CADASTRAR-SE GRÁTIS
                </Button>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  show: boolean
  onToggle: () => void
}

function PasswordInput({ show, onToggle, ...props }: PasswordInputProps) {
  return (
    <div className="relative">
      <CustomInput
        {...props}
        type={show ? 'text' : 'password'}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors"
        aria-label={show ? 'Esconder senha' : 'Mostrar senha'}
      >
        {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
      </button>
    </div>
  )
}