import { useState } from 'react';
import { useNavigate } from 'react-router';

// --- PÁGINA DA ETAPA 2 ---
export default function AddressPage() {
  const [selectedAddress, setSelectedAddress] = useState('addr1');
  let navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione seu endereço:</h2>
      <div className="space-y-3">
        <label className={`block border rounded-md p-4 cursor-pointer ${selectedAddress === 'addr1' ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
          <div className="flex items-center">
            <input type="radio" name="address" value="addr1" checked={selectedAddress === 'addr1'} onChange={() => setSelectedAddress('addr1')} className="w-4 h-4 accent-primary" />
            <div className="ml-3 text-sm">
              <span className="font-bold">Rua Jacarezinho, 453</span> - Santa Fé, PR, CEP 86770000
            </div>
          </div>
        </label>
        <label className={`block border rounded-md p-4 cursor-pointer ${selectedAddress === 'addr2' ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
          <div className="flex items-center">
            <input type="radio" name="address" value="addr2" checked={selectedAddress === 'addr2'} onChange={() => setSelectedAddress('addr2')} className="w-4 h-4 accent-primary" />
            <div className="ml-3 text-sm">
              <span className="font-bold">Rua Apucarana, 285</span> - Santa Fé, PR, CEP 86770000
            </div>
          </div>
        </label>
        <label className={`block border rounded-md p-4 cursor-pointer ${selectedAddress === 'addr3' ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
          <div className="flex items-center">
            <input type="radio" name="address" value="addr3" checked={selectedAddress === 'addr3'} onChange={() => setSelectedAddress('addr3')} className="w-4 h-4 accent-primary" />
            <div className="ml-3 text-sm">
              <span className="font-bold">Rua luiz roncolho, 169</span> - Santa Fé, PR, CEP 86770000
            </div>
          </div>
        </label>
      </div>
      <button
        className="mt-6 text-xs font-bold text-primary hover:text-primary cursor-pointer"
        onClick={() => {
          navigate('/minhaconta/enderecos');
        }}
      >
        CADASTRAR NOVO ENDEREÇO
      </button>
    </div>
  );
}