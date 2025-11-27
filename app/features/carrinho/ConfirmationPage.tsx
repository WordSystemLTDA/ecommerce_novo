/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaBoxes, FaRegUserCircle, FaTag } from 'react-icons/fa';

// (Mock data e interfaces são necessários aqui para a lista de produtos)
const mockProducts = [
  {
    id: 1,
    vendor: 'KaBuM!',
    image: 'https://img.ibxk.com.br/2023/09/13/13101859188151.jpg?imgo=REDIM_CONTENT&size=500x281',
    title: 'iPhone 16 Plus Apple 512GB, Câmera Dupla de 48MP, Tela 6,7", Preto',
    price: 8299.90,
    discountPrice: 8239.90,
    installments: 'cartão sem juros R$ 9.222,11',
  },
  {
    id: 2,
    vendor: 'KaBuM!',
    image: 'https://images.kabum.com.br/produtos/fotos/114385/cadeira-gamer-husky-gaming-tempest-700-preto-hct-700_1594994640_m.jpg',
    title: 'Cadeira Gamer Husky Tempest 700, Até 145kg, Almofadas, Reclinável 150°, Tecido, Descanso para Pés, Cinza - HCT-070C2T',
    price: 779.90,
    discountPrice: 779.90,
    installments: 'cartão sem juros R$ 866.56',
  },
];

// --- PÁGINA DA ETAPA 5 ---
export default function ConfirmationPage() {
  return (
    <div className="space-y-6">
      {/* Dados Pessoais */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
          <FaRegUserCircle /> DADOS PESSOAIS
        </h2>
        <p className="text-xs text-gray-500 mb-4">Informações que serão inseridas na nota fiscal do pedido.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><span className="font-bold">Nome:</span> João Pedro Siqueira Chiquitin</p>
            <p><span className="font-bold">RG:</span></p>
            <p><span className="font-bold">Celular:</span> 4499198369</p>
            <p><span className="font-bold">CEP:</span> 86770000</p>
          </div>
          <div>
            <p><span className="font-bold">CPF/CNPJ:</span> 07795533905</p>
            <p><span className="font-bold">Telefone:</span></p>
            <p><span className="font-bold">E-mail:</span> joaopchiquitin@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
          <FaBoxes /> LISTA DE PRODUTOS
        </h2>
        <p className="text-xs text-gray-500 mb-4">Vendido e entregue por: <span className="font-bold">KaBuM!</span></p>
        
        {/* Item 1 */}
        <div className="flex gap-4 border-b pb-4 mb-4">
          <img src={mockProducts[0].image} alt={mockProducts[0].title} className="w-16 h-16 object-contain rounded" />
          <div className="grow">
            <p className="text-sm text-gray-700">{mockProducts[0].title}</p>
            <p className="text-xs text-gray-500">Com desconto no PIX: R$ 8.239,90</p>
            <p className="text-xs text-gray-500">Parcelado no cartão sem juros: R$ 9.222,11</p>
            <span className="flex items-center gap-1 text-xs text-orange-500 mt-1"><FaTag size={12} /> OFERTA NINJA</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Quant: 1</p>
            <p className="text-sm text-gray-500">Preço à vista no PIX:</p>
            <p className="text-lg font-bold text-orange-500">R$ 8.299,90</p>
          </div>
        </div>
        
        {/* Serviços Item 1 */}
        <div className="mb-4">
          <h3 className="font-bold text-sm text-gray-800 mb-2">SERVIÇOS</h3>
          <div className="flex justify-between items-center text-sm">
            <p>Garantia Estendida Kabum - <span className="font-bold">12 Meses</span></p>
            <div className="text-right">
              <p className="text-xs text-gray-500">Subtotal serviços:</p>
              <p className="text-sm font-bold text-gray-800">R$ 1.751,34</p>
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex gap-4 border-t pt-4">
          <img src={mockProducts[1].image} alt={mockProducts[1].title} className="w-16 h-16 object-contain rounded" />
          <div className="grow">
            <p className="text-sm text-gray-700">{mockProducts[1].title}</p>
            <p className="text-xs text-gray-500">Com desconto no PIX: R$ 779,90</p>
            <p className="text-xs text-gray-500">Parcelado no cartão sem juros: R$ 866.56</p>
            <span className="flex items-center gap-1 text-xs text-orange-500 mt-1"><FaTag size={12} /> OFERTA NINJA</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Quant: 1</p>
            <p className="text-sm text-gray-500">Preço à vista no PIX:</p>
            <p className="text-lg font-bold text-orange-500">R$ 779,90</p>
          </div>
        </div>
        {/* Serviços Item 2 */}
        <div className="mt-4">
          <h3 className="font-bold text-sm text-gray-800 mb-2">SERVIÇOS</h3>
          <div className="flex justify-between items-center text-sm">
            <p>Sem garantia</p>
            <div className="text-right">
              <p className="text-xs text-gray-500">Subtotal serviços:</p>
              <p className="text-sm font-bold text-gray-800">R$ 0,00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}