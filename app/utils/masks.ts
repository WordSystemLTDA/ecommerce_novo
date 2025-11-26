// utils/masks.ts

export const normalizeCpf = (value: string) => {
  if (!value) return "";
  
  return value
    .replace(/[\D]/g, "") // Remove tudo o que não é dígito
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o terceiro e o quarto dígitos
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o terceiro e o quarto dígitos de novo (para o segundo bloco de números)
    .replace(/(\d{3})(\d{1,2})/, "$1-$2") // Coloca um hífen entre o terceiro e o quarto dígitos
    .replace(/(-\d{2})\d+?$/, "$1"); // Impede que o usuário digite mais de 11 dígitos
};

export const normalizeCnpj = (value: string) => {
  if (!value) return "";
  
  return value
    .replace(/[\D]/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const normalizeRg = (value: string) => {
  if (!value) return "";
  
  // RG é mais flexível pois varia por estado, mas esta é a máscara padrão (99.999.999-9)
  return value
    .replace(/[\D]/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1})/, "$1-$2")
    .replace(/(-\d{1})\d+?$/, "$1");
};