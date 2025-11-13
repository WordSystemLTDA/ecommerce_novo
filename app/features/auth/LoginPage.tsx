import React, { useState } from 'react'
// --- CORREÇÃO ---
// Alterando o caminho de importação dos ícones para ser mais explícito
// Isso deve resolver o erro "Could not resolve"
import { FaLock } from 'react-icons/fa'
import { FaUserPlus } from 'react-icons/fa'
import { FiEye } from 'react-icons/fi'
import { FiEyeOff } from 'react-icons/fi'
// --- FIM DA CORREÇÃO ---

import type { IconType } from 'react-icons'
import { Header } from '~/components/header'
import { NavLink, redirect, useNavigate } from 'react-router'
// --- 1. Componente Principal (A Página) ---

/**
 * Componente principal da página de Login/Cadastro.
 * Gerencia o estado do formulário de login.
 */
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  let navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica de login aqui
    console.log('Login attempt:', { email, password, rememberMe })
  }

  return (
    <div>
      <Header />
      <div className="relative flex flex-col items-center bg-white p-4 py-16 text-gray-700">

        <main className="w-full max-w-5xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">

            {/* Coluna 1: Login */}
            <div className="flex flex-col">
              <IconCircle icon={FaLock} color="red" />
              <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900">
                Já tem uma conta?
              </h2>
              <p className="mb-6 text-center text-sm">
                Informe os seus dados abaixo para acessá-la.
              </p>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                {/* Campo de E-mail */}
                <CustomInput
                  type="email"
                  placeholder="E-mail *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {/* Campo de Senha */}
                <PasswordInput
                  placeholder="Senha *"
                  show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {/* Checkbox "Lembrar" */}
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-400 bg-white text-red-600 focus:ring-red-500"
                  />
                  Lembrar meus dados
                </label>

                {/* Botão de Acessar */}
                <Button variant="red" type="submit">
                  ACESSAR CONTA
                </Button>

                {/* Link "Esqueci a senha" */}
                <a
                  href="#"
                  className="mt-2 text-center text-sm text-red-600 hover:text-red-700 hover:underline"
                >
                  Esqueci minha senha
                </a>
              </form>
            </div>

            {/* Coluna 2: Novo Cliente */}
            <div className="flex flex-col">
              <IconCircle icon={FaUserPlus} color="green" />
              <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900">
                Novo Cliente
              </h2>
              <p className="mb-6 text-center text-sm">
                Criar uma conta é fácil! Informe seus dados e uma senha para
                aproveitar todos os benefícios de ter uma conta.
              </p>

              {/* Botão de Cadastrar */}
              <Button variant="green" type="button" onClick={() => navigate("/register/")}>
                CADASTRE-SE
              </Button>
            </div>

          </div>
        </main>

      </div>
    </div>
  )
}

// --- 2. Componentes Auxiliares Reutilizáveis ---

// --- Círculo do Ícone ---
interface IconCircleProps {
  icon: IconType
  color: 'red' | 'green'
}

/**
 * Círculo customizado para exibir o ícone no topo de cada coluna.
 */
function IconCircle({ icon: Icon, color }: IconCircleProps) {
  const colorClasses = {
    red: 'bg-red-600',
    green: 'bg-green-500',
  }
  return (
    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${colorClasses[color]}`}>
      <Icon className="text-3xl text-white" />
    </div>
  )
}

// --- Input Padrão (para E-mail) ---
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

/**
 * Componente de input customizado com o estilo da página.
 */
function CustomInput(props: CustomInputProps) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-gray-400 bg-white p-3 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
    />
  )
}

// --- Input de Senha (com ícone de olho) ---
interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  show: boolean
  onToggle: () => void
}

/**
 * Componente de input de senha com botão para mostrar/esconder.
 */
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

// --- Botão Customizado (Vermelho ou Verde) ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'red' | 'green'
}

/**
 * Botão customizado com variantes de cor (vermelho ou verde).
 */
function Button({ variant, children, ...props }: ButtonProps) {
  const colorClasses = {
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    green: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
  }
  return (
    <button
      {...props}
      className={`w-full rounded-md p-3 font-bold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${colorClasses[variant]}`}
    >
      {children}
    </button>
  )
}