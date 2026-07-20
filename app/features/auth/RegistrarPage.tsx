import React, { useState } from 'react'
import { FaBuilding } from 'react-icons/fa'
import { FiFileText, FiLock, FiMail, FiPhone, FiUser, FiUserPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router'
import Button from '~/components/button'
import Footer from '~/components/footer'
import Header from '~/components/header'
import CustomInput from '~/components/input'
import InputIE from '~/components/input_ie'
import PasswordInput from '~/components/password_input'
import CustomSelect from '~/components/select'
import { normalizeCnpj, normalizeCpf, normalizePhone } from '~/utils/masks'
import { authService } from './services/authService'

export default function RegistrarPage() {
    const [nome, setNome] = useState('');
    const [tipoPessoa, setTipoPessoa] = useState('Física');
    const [email, setEmail] = useState('');
    const [celular, setCelular] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [aceitaMarketing, setAceitaMarketing] = useState(true);
    const [aceitaTermos, setAceitaTermos] = useState(false);

    const [cpf, setCpf] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [ie, setIe] = useState('');
    const [isentoIE, setIsentoIE] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage(null);
        setIsSubmitting(true);
        const isPessoaFisica = tipoPessoa.startsWith('F');
        const isPessoaJuridica = tipoPessoa.startsWith('J');
        const formattedDoc = isPessoaFisica
            ? normalizeCpf(cpf)
            : normalizeCnpj(cnpj);
        const formattedPhone = normalizePhone(celular);
        const trimmedNome = nome.trim();
        const trimmedRazaoSocial = isPessoaJuridica
            ? razaoSocial.trim()
            : trimmedNome;

        try {
            const response = await authService.registrar({
                doc: formattedDoc,
                celular: formattedPhone,
                telefone: formattedPhone,
                email: email.trim(),
                nome: trimmedNome,
                razao_social: trimmedRazaoSocial,
                senha: password,
                tipo_pessoa: tipoPessoa,
                status_representante: 'Cliente',
                tipo_de_conta: 'Conta Corrente',
                tipo_chave_pix: 'CPF',
                civil: 'Solteiro(a)',
                sexo: 'Masculino',
                tipo_de_contribuinte: 9,
                consumidor_final: 1,
                ...(isPessoaJuridica && ie.trim() ? { ie: ie.trim() } : {}),
            });

            if (!response?.sucesso) {
                setErrorMessage(response?.mensagem ?? 'Nao foi possivel finalizar seu cadastro.');
                return;
            }

            navigate('/entrar');
        } catch (error) {
            const errorPayload =
                (error as any)?.response?.data ||
                (error as any)?.error ||
                error;
            const camposFaltantes = errorPayload?.data?.campos_faltantes;
            const apiMessage =
                errorPayload?.mensagem ||
                errorPayload?.message ||
                errorPayload?.error;

            setErrorMessage(
                camposFaltantes?.length
                    ? `${apiMessage ?? 'Dados incompletos'}: ${camposFaltantes.join(', ')}.`
                    : apiMessage ?? 'Ocorreu um erro ao criar a conta. Tente novamente.'
            );
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-main-bg">
            <Header />

            <main className="flex-1 flex items-start justify-center px-4 py-12">
                <div className="w-full max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6">
                        <aside className="rounded-2xl border border-slate-100 bg-white/70 backdrop-blur-sm shadow-[0_4px_24px_rgba(15,23,42,0.05)] p-8 flex flex-col">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary mb-4">
                                <FiUserPlus size={18} />
                            </div>
                            <p className="text-xs uppercase tracking-widest text-primary/50 font-medium">Cadastro</p>
                            <h2 className="font-serif text-2xl font-semibold text-slate-800 mt-1">Sua conta em minutos</h2>
                            <p className="text-sm text-slate-500 leading-relaxed mt-4">
                                Finalize seu cadastro para acompanhar pedidos, salvar enderecos e ter uma experiencia de compra mais rapida.
                            </p>

                            <div className="mt-8 space-y-3 text-sm text-slate-600">
                                <div className="rounded-xl border border-slate-100 bg-white/80 px-4 py-3">Checkout mais rapido</div>
                                <div className="rounded-xl border border-slate-100 bg-white/80 px-4 py-3">Historico completo de pedidos</div>
                                <div className="rounded-xl border border-slate-100 bg-white/80 px-4 py-3">Promocoes e ofertas exclusivas</div>
                            </div>

                            <p className="text-sm text-slate-500 mt-auto pt-6">
                                Ja possui cadastro?{' '}
                                <a href="/entrar" className="text-primary hover:underline underline-offset-2 transition-colors">
                                    Entrar agora
                                </a>
                            </p>
                        </aside>

                        <section className="rounded-2xl border border-slate-100 bg-white/70 backdrop-blur-sm shadow-[0_4px_24px_rgba(15,23,42,0.05)] p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary">
                                    <FiUserPlus size={18} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-primary/50 font-medium">Novo por aqui?</p>
                                    <h2 className="font-serif text-xl font-semibold text-slate-800">Criar minha conta</h2>
                                </div>
                            </div>

                            <form onSubmit={handleRegister} className="flex flex-col gap-6">
                                {errorMessage && (
                                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs uppercase tracking-wider text-primary/60 font-medium">Tipo de pessoa</label>
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
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs uppercase tracking-wider text-primary/60 font-medium flex items-center gap-1.5">
                                                <FiUser size={12} /> Nome completo
                                            </label>
                                            <CustomInput
                                                type="text"
                                                placeholder="Seu nome completo"
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs uppercase tracking-wider text-primary/60 font-medium flex items-center gap-1.5">
                                                <FiFileText size={12} /> CPF
                                            </label>
                                            <CustomInput
                                                type="text"
                                                placeholder="000.000.000-00"
                                                value={cpf}
                                                onChange={(e) => setCpf(normalizeCpf(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {tipoPessoa === 'Jurídica' && (
                                    <>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs uppercase tracking-wider text-primary/60 font-medium flex items-center gap-1.5">
                                                    <FaBuilding size={12} /> Nome fantasia
                                                </label>
                                                <CustomInput
                                                    type="text"
                                                    placeholder="Nome fantasia"
                                                    value={nome}
                                                    onChange={(e) => setNome(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs uppercase tracking-wider text-primary/60 font-medium">Razão social</label>
                                                <CustomInput
                                                    type="text"
                                                    placeholder="Razão social"
                                                    value={razaoSocial}
                                                    onChange={(e) => setRazaoSocial(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs uppercase tracking-wider text-primary/60 font-medium flex items-center gap-1.5">
                                                    <FiFileText size={12} /> CNPJ
                                                </label>
                                                <CustomInput
                                                    type="text"
                                                    placeholder="00.000.000/0000-00"
                                                    value={cnpj}
                                                    onChange={(e) => setCnpj(normalizeCnpj(e.target.value))}
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs uppercase tracking-wider text-primary/60 font-medium">Inscrição estadual</label>
                                                <InputIE
                                                    value={ie}
                                                    onChange={(e) => setIe(e.target.value)}
                                                    isento={isentoIE}
                                                    onIsentoChange={(e) => {
                                                        setIe(e.target.checked ? 'ISENTO' : '');
                                                        setIsentoIE(e.target.checked);
                                                    }}
                                                    required={!isentoIE}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="border-t border-slate-100" />

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                            <FiPhone size={12} /> Celular
                                        </label>
                                        <CustomInput
                                            type="tel"
                                            placeholder="(00) 00000-0000"
                                            value={celular}
                                            onChange={(e) => setCelular(normalizePhone(e.target.value))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs uppercase tracking-wider text-primary/60 font-medium flex items-center gap-1.5">
                                        <FiLock size={12} /> Senha
                                    </label>
                                    <PasswordInput
                                        placeholder="Crie uma senha segura"
                                        show={showPassword}
                                        onToggle={() => setShowPassword(!showPassword)}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="border-t border-slate-100" />

                                <div className="flex flex-col gap-3">
                                    <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={aceitaMarketing}
                                            onChange={(e) => setAceitaMarketing(e.target.checked)}
                                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-primary/30 accent-primary"
                                        />
                                        <span>Aceito receber comunicações e novidades por e-mail</span>
                                    </label>

                                    <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={aceitaTermos}
                                            onChange={(e) => setAceitaTermos(e.target.checked)}
                                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-primary/30 accent-primary"
                                            required
                                        />
                                        <span>
                                            Li e concordo com os{' '}
                                            <a href="#" className="text-primary underline-offset-2 hover:underline">termos de uso</a>{' '}e{' '}
                                            <a href="#" className="text-primary underline-offset-2 hover:underline">política de privacidade</a>
                                        </span>
                                    </label>
                                </div>

                                <Button variant="primary" type="submit" className="mt-2" disabled={isSubmitting}>
                                    {isSubmitting ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
                                </Button>

                                <p className="text-center text-sm text-slate-500 lg:hidden">
                                    Ja tem conta?{' '}
                                    <a href="/entrar" className="text-primary hover:underline underline-offset-2 transition-colors">
                                        Acessar agora
                                    </a>
                                </p>
                            </form>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
