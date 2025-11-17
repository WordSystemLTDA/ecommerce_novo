import React, { useState } from 'react'
import type { IconType } from 'react-icons'
// --- CORREÇÃO ---
// Os caminhos 'react-icons/fa' e 'react-icons/fi' não estão resolvendo.
// Vamos tentar importar tudo de um único ponto, o que é mais provável de funcionar
// se a biblioteca estiver instalada.
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { FaUserPlus } from 'react-icons/fa'

// O erro "~/components/header" indica que o alias (~) não está funcionando
// e o caminho relativo ('../') também não.
// Vou reverter para o alias (~), pois é o mais provável de estar
// correto no *seu* ambiente de projeto (baseado no seu tsconfig/vite.config).
import { Header } from '~/components/header' // Você usará seu header aqui
import CustomInput from '~/components/input'
import Button from '~/components/button'
import IconCircle from '~/components/icon_circle'
import Footer from '~/components/footer'
// --- FIM DA CORREÇÃO ---

// --- 1. Componente Principal (Página de Cadastro) ---

export default function RegisterPage() {
    // --- Estados do Formulário ---
    // Comuns
    const [nome, setNome] = useState('')
    const [sobrenome, setSobrenome] = useState('')
    const [tipoPessoa, setTipoPessoa] = useState('fisica') // 'fisica' ou 'juridica'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [aceitaMarketing, setAceitaMarketing] = useState(true)
    const [aceitaTermos, setAceitaTermos] = useState(false)

    // Pessoa Física
    const [cpf, setCpf] = useState('')
    const [rg, setRg] = useState('')

    // Pessoa Jurídica (NOVOS ESTADOS)
    const [nomeFantasia, setNomeFantasia] = useState('')
    const [razaoSocial, setRazaoSocial] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [ie, setIe] = useState('')
    const [isentoIE, setIsentoIE] = useState(false) // Para o checkbox 'ISENTO'

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault()
        // Lógica de cadastro aqui
        const data = {
            nome,
            sobrenome,
            tipoPessoa,
            email,
            password,
            aceitaMarketing,
            aceitaTermos,
            // Dados condicionais
            ...(tipoPessoa === 'fisica'
                ? { cpf, rg }
                : { nomeFantasia, razaoSocial, cnpj, ie, isentoIE }),
        }
        console.log('Register attempt:', data)
    }

    return (
        <div>
            <Header />

            {/* Container principal com padding vertical e centralização horizontal */}
            <div className="relative flex flex-col items-center bg-white p-4 py-4 text-gray-700">

                {/* Box de conteúdo central - usei max-w-3xl para um formulário mais estreito */}
                <main className="w-full max-w-387">
                    <div className="flex flex-col">
                        {/* Ícone e Título */}
                        <IconCircle icon={FaUserPlus} color="primary" />
                        <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900">
                            Criar minha conta
                        </h2>
                        <p className="mb-6 text-center text-sm">
                            Informe os seus dados abaixo para criar sua conta.
                        </p>

                        {/* Formulário de Cadastro */}
                        <form onSubmit={handleRegister} className="flex flex-col gap-4">
                            {/* Grid para campos lado a lado */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <CustomInput
                                    type="text"
                                    placeholder="Nome *"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                                <CustomInput
                                    type="text"
                                    placeholder="Sobrenome *"
                                    value={sobrenome}
                                    onChange={(e) => setSobrenome(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Campo "Quero me cadastrar como" */}
                                <CustomSelect
                                    value={tipoPessoa}
                                    onChange={(e) => setTipoPessoa(e.target.value)}
                                    required
                                >
                                    <option value="fisica">Pessoa Física</option>
                                    <option value="juridica">Pessoa Jurídica</option>
                                </CustomSelect>
                            </div>

                            {/* --- ALTERAÇÃO: CAMPOS CONDICIONAIS --- */}

                            {/* Campos de Pessoa Física */}
                            {tipoPessoa === 'fisica' && (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <CustomInput
                                        type="text"
                                        placeholder="CPF *"
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                        required
                                    />
                                    <CustomInput
                                        type="text"
                                        placeholder="RG"
                                        value={rg}
                                        onChange={(e) => setRg(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* Campos de Pessoa Jurídica (NOVOS) */}
                            {tipoPessoa === 'juridica' && (
                                <>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <CustomInput
                                            type="text"
                                            placeholder="Nome Fantasia *"
                                            value={nomeFantasia}
                                            onChange={(e) => setNomeFantasia(e.target.value)}
                                            required
                                        />
                                        <CustomInput
                                            type="text"
                                            placeholder="Razão Social *"
                                            value={razaoSocial}
                                            onChange={(e) => setRazaoSocial(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <CustomInput
                                            type="text"
                                            placeholder="CNPJ *"
                                            value={cnpj}
                                            onChange={(e) => setCnpj(e.target.value)}
                                            required
                                        />
                                        {/* Campo de IE com Checkbox "ISENTO" */}
                                        <InputIE
                                            value={ie}
                                            onChange={(e) => setIe(e.target.value)}
                                            isento={isentoIE}
                                            onIsentoChange={(e) => {
                                                if (e.target.checked) {
                                                    setIe('ISENTO');
                                                } else {
                                                    setIe('');
                                                }

                                                setIsentoIE(e.target.checked);
                                            }}
                                            required={!isentoIE} // IE é obrigatório A MENOS que "ISENTO" esteja marcado
                                        />
                                    </div>
                                </>
                            )}

                            {/* --- FIM DA ALTERAÇÃO --- */}

                            {/* Campos de largura total (comuns) */}
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

                            {/* Checkboxes */}
                            <label className="flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={aceitaMarketing}
                                    onChange={(e) => setAceitaMarketing(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-400 bg-white text-primary focus:ring-terciary"
                                />
                                <span className="text-primary">Aceito receber comunicação de marketing da Word System</span>
                            </label>

                            <label className="flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={aceitaTermos}
                                    onChange={(e) => setAceitaTermos(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-400 bg-white text-primary focus:ring-terciary"
                                    required
                                />
                                <span>
                                    Estou ciente e CONCORDO com os{' '}
                                    <a href="#" className="font-semibold text-gray-900 hover:underline">
                                        termos de aceite
                                    </a>{' '}
                                    e{' '}
                                    <a href="#" className="font-semibold text-gray-900 hover:underline">
                                        políticas de privacidade
                                    </a>{' '}
                                    da Word System.
                                </span>
                            </label>

                            {/* Botão de Criar Conta */}
                            <Button variant="primary" type="submit" className="mt-4">
                                CRIAR CONTA
                            </Button>

                            {/* Link "Voltar" */}
                            <a
                                href="/entrar" // Idealmente, isso seria um <Link> do seu roteador
                                className="mt-2 text-center text-sm text-gray-600 hover:text-gray-900 hover:underline"
                            >
                                Voltar para o login
                            </a>
                        </form>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    )
}

// --- Select Customizado (NOVO) ---
interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

function CustomSelect(props: CustomSelectProps) {
    return (
        <select
            {...props}
            className="w-full rounded-md border border-gray-400 bg-white p-3 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        >
            {props.children}
        </select>
    )
}

// --- Input de IE (NOVO - Componente específico) ---
interface InputIEProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isento: boolean
    onIsentoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function InputIE({ isento, onIsentoChange, ...props }: InputIEProps) {
    return (
        <div className="relative">
            <CustomInput
                {...props}
                type="text"
                placeholder="IE"
                disabled={isento} // Desabilita o input se 'ISENTO' estiver marcado
            />
            <label className="absolute right-3 top-1/3 -translate-y-1-2 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input
                    type="checkbox"
                    checked={isento}
                    onChange={onIsentoChange}
                    className="h-4 w-4 rounded border-gray-400 text-red-600 focus:ring-red-500"
                />
                ISENTO
            </label>
        </div>
    )
}


// --- Input de Senha ---
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
                className="absolute right-3 top-1-2 -translate-y-1-2 text-gray-500 hover:text-gray-900"
                aria-label={show ? 'Esconder senha' : 'Mostrar senha'}
            >
                {show ? <FiEyeOff /> : <FiEye />}
            </button>
        </div>
    )
}
