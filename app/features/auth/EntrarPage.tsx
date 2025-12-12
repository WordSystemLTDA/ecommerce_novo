import React, { useState } from 'react'
import { FaLock, FaUserPlus } from 'react-icons/fa'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useNavigate } from 'react-router'
import Button from '~/components/button'
import Footer from '~/components/footer'
import Header from '~/components/header'
import IconCircle from '~/components/icon_circle'
import CustomInput from '~/components/input'
import { useAuth } from './context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const { login } = useAuth();
  let navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, senha: password });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Header />
      <div className="relative flex flex-col items-center bg-white p-4 py-16 text-gray-700">

        <main className="w-full max-w-387">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">

            <div className="flex flex-col">
              <IconCircle icon={FaLock} color='primary' />
              <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900">
                Já tem uma conta?
              </h2>
              <p className="mb-6 text-center text-sm">
                Informe os seus dados abaixo para acessá-la.
              </p>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <CustomInput
                  type="email"
                  placeholder="E-mail *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <PasswordInput
                  placeholder="Senha *"
                  show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-400 bg-white text-primary focus:ring-terciary"
                  />
                  Lembrar meus dados
                </label>

                <Button
                  variant="primary"
                  type="submit"
                >
                  ACESSAR CONTA
                </Button>

                <a
                  href="#"
                  className="mt-2 text-center text-sm text-primary hover:text-terciary hover:underline"
                >
                  Esqueci minha senha
                </a>
              </form>
            </div>

            <div className="flex flex-col">
              <IconCircle icon={FaUserPlus} color="green" />
              <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900">
                Novo Cliente
              </h2>
              <p className="mb-6 text-center text-sm">
                Criar uma conta é fácil! Informe seus dados e uma senha para
                aproveitar todos os benefícios de ter uma conta.
              </p>

              <Button variant="primary" type="button" onClick={() => navigate("/registrar/")}>
                CADASTRE-SE
              </Button>
            </div>

          </div>
        </main>

      </div>

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
        className="w-full rounded-md border border-gray-400 bg-white p-3 pr-10 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
        aria-label={show ? 'Esconder senha' : 'Mostrar senha'}
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  )
}