import React, { useState } from 'react'
import type { IconType } from 'react-icons'
// --- CORREÇÃO ---
// Os caminhos 'react-icons/fa' e 'react-icons/fi' não estão resolvendo.
// Vamos tentar importar tudo de um único ponto, o que é mais provável de funcionar
// se a biblioteca estiver instalada.

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
import CustomSelect from '~/components/select'
import InputIE from '~/components/input_ie'
import PasswordInput from '~/components/password_input'
// --- FIM DA CORREÇÃO ---

// --- 1. Componente Principal (Página de Cadastro) ---

export default function RegistrarPage() {
    // --- Estados do Formulário ---
    // Comuns
    const [nome, setNome] = useState('')
    // const [sobrenome, setSobrenome] = useState('')
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
    // const [nomeFantasia, setNomeFantasia] = useState('')
    const [razaoSocial, setRazaoSocial] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [ie, setIe] = useState('')
    const [isentoIE, setIsentoIE] = useState(false) // Para o checkbox 'ISENTO'

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault()
        // Lógica de cadastro aqui
        const data = {
            nome,
            tipoPessoa,
            email,
            password,
            aceitaMarketing,
            aceitaTermos,
            // Dados condicionais
            ...(tipoPessoa === 'fisica'
                ? { cpf, rg }
                : { nome, razaoSocial, cnpj, ie, isentoIE }),
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
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
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

                            {/* Campos de Pessoa Física */}
                            {tipoPessoa === 'fisica' && (
                                <>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                                        <CustomInput
                                            type="text"
                                            placeholder="Nome *"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            required
                                        />
                                    </div>

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
                                </>
                            )}

                            {/* Campos de Pessoa Jurídica (NOVOS) */}
                            {tipoPessoa === 'juridica' && (
                                <>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <CustomInput
                                            type="text"
                                            placeholder="Nome Fantasia *"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
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







