import React from 'react';

// --- PÁGINA DA ETAPA 3 ---
export default function DeliveryPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600">Endereço selecionado: <span className="font-bold text-gray-800">Rua Jacarezinho, 453 - Centro - Santa Fé/PR - CEP: 86770-000</span></p>
      </div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o tipo de entrega</h2>
      <p className="text-sm font-medium mb-2">Vendido e entregue por: <span className="font-bold">KaBuM!</span></p>
      
      <div className="space-y-3">
        <label className="block border border-orange-500 ring-2 ring-orange-500 rounded-md p-4 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="radio" name="delivery" defaultChecked className="w-4 h-4 accent-orange-500" />
              <div className="ml-3 text-sm">
                <span className="font-bold">Entrega Econômica</span>
                <p className="text-gray-600">Chegará até 04/12/2025</p>
              </div>
            </div>
            <span className="text-sm font-bold">R$ 87,39</span>
          </div>
        </label>
      </div>
      <p className="text-xs text-gray-500 mt-4">*Mediante a confirmação de pagamento até às <span className="font-bold">13 horas</span>.</p>
    </div>
  );
}