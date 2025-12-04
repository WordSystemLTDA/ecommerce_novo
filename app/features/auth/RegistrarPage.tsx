import React, { useState } from 'react'
import { FaUserPlus } from 'react-icons/fa'
import Button from '~/components/button'
import Footer from '~/components/footer'
import Header from '~/components/header';
import IconCircle from '~/components/icon_circle'
import CustomInput from '~/components/input'
import InputIE from '~/components/input_ie'
import PasswordInput from '~/components/password_input'
import CustomSelect from '~/components/select'
import { normalizeCnpj, normalizeCpf, normalizeRg } from '~/utils/masks'
import { authService } from './services/authService'

export default function RegistrarPage() {
    const [nome, setNome] = useState('');
    const [tipoPessoa, setTipoPessoa] = useState('Física');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [aceitaMarketing, setAceitaMarketing] = useState(true);
    const [aceitaTermos, setAceitaTermos] = useState(false);

    const [cpf, setCpf] = useState('');
    const [rg, setRg] = useState('');

    const [razaoSocial, setRazaoSocial] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [ie, setIe] = useState('');
    const [isentoIE, setIsentoIE] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        await authService.registrar({
            doc: tipoPessoa === 'Física' ? cpf : cnpj,
            email,
            ie,
            nome,
            razao_social: razaoSocial,
            rg,
            senha: password,
            tipo_pessoa: tipoPessoa
        });
    }

    return (
        <div>
            <Header />

            <div className="relative flex flex-col items-center bg-white p-4 py-4 text-gray-700">

                <main className="w-full max-w-387">
                    <div className="flex flex-col">
                        <IconCircle icon={FaUserPlus} color="primary" />
                        <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900">
                            Criar minha conta
                        </h2>
                        <p className="mb-6 text-center text-sm">
                            Informe os seus dados abaixo para criar sua conta.
                        </p>

                        <form onSubmit={handleRegister} className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                                <CustomSelect
                                    value={tipoPessoa}
                                    onChange={(e) => setTipoPessoa(e.target.value)}
                                    required
                                >
                                    <option value="Física">Pessoa Física</option>
                                    <option value="Jurídica">Pessoa Jurídica</option>
                                </CustomSelect>
                            </div>

                            {tipoPessoa === 'Física' && (
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
                                            onChange={(e) => setCpf(normalizeCpf(e.target.value))}
                                            required
                                        />
                                        <CustomInput
                                            type="text"
                                            placeholder="RG"
                                            value={rg}
                                            onChange={(e) => setRg(normalizeRg(e.target.value))}
                                        />
                                    </div>
                                </>
                            )}

                            {tipoPessoa === 'Jurídica' && (
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
                                            onChange={(e) => setCnpj(normalizeCnpj(e.target.value))}
                                            required
                                        />
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
                                            required={!isentoIE}
                                        />
                                    </div>
                                </>
                            )}

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

                            <Button variant="primary" type="submit" className="mt-4">
                                CRIAR CONTA
                            </Button>

                            <a
                                href="/entrar"
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
