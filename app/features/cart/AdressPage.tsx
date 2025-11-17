import React, { useState } from 'react';

// --- PÁGINA DA ETAPA 2 ---
export default function AddressPage() {
  const [selectedAddress, setSelectedAddress] = useState('addr1');
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione seu endereço:</h2>
      <div className="space-y-3">
        <label className={`block border rounded-md p-4 cursor-pointer ${selectedAddress === 'addr1' ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300'}`}>
          <div className="flex items-center">
            <input type="radio" name="address" value="addr1" checked={selectedAddress === 'addr1'} onChange={() => setSelectedAddress('addr1')} className="w-4 h-4 accent-orange-500" />
            <div className="ml-3 text-sm">
              <span className="font-bold">Rua Jacarezinho, 453</span> - Santa Fé, PR, CEP 86770000
            </div>
          </div>
        </label>
        <label className={`block border rounded-md p-4 cursor-pointer ${selectedAddress === 'addr2' ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300'}`}>
          <div className="flex items-center">
            <input type="radio" name="address" value="addr2" checked={selectedAddress === 'addr2'} onChange={() => setSelectedAddress('addr2')} className="w-4 h-4 accent-orange-500" />
            <div className="ml-3 text-sm">
              <span className="font-bold">Rua Apucarana, 285</span> - Santa Fé, PR, CEP 86770000
            </div>
          </div>
        </label>
        <label className={`block border rounded-md p-4 cursor-pointer ${selectedAddress === 'addr3' ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300'}`}>
          <div className="flex items-center">
            <input type="radio" name="address" value="addr3" checked={selectedAddress === 'addr3'} onChange={() => setSelectedAddress('addr3')} className="w-4 h-4 accent-orange-500" />
            <div className="ml-3 text-sm">
              <span className="font-bold">Rua luiz roncolho, 169</span> - Santa Fé, PR, CEP 86770000
            </div>
          </div>
        </label>
      </div>
      <button className="mt-6 text-sm font-bold text-orange-500 hover:text-orange-600">
        CADASTRAR NOVO ENDEREÇO
      </button>
    </div>
  );
}