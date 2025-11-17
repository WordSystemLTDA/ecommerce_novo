import React, { useState } from 'react';
import { FaCreditCard, FaQrcode } from 'react-icons/fa';
import { SiNubank } from 'react-icons/si';

// --- PÁGINA DA ETAPA 4 ---
export default function PaymentPage() {
  const [selectedPayment, setSelectedPayment] = useState('pix');
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">FORMA DE PAGAMENTO</h2>
      <div className="space-y-3">
        <label className={`block border rounded-md p-4 cursor-pointer ${selectedPayment === 'pix' ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="radio" name="payment" value="pix" checked={selectedPayment === 'pix'} onChange={() => setSelectedPayment('pix')} className="w-4 h-4 accent-orange-500" />
              <div className="ml-3 text-sm">
                <span className="font-bold">PIX</span>
              </div>
            </div>
            <FaQrcode className="text-gray-500" size={20} />
          </div>
          {selectedPayment === 'pix' && (
            <p className="text-sm text-gray-600 mt-3 ml-7">Até <span className="font-bold">22% de desconto</span> com <span className="font-bold">aprovação imediata</span> que torna a <span className="font-bold">expedição mais rápida</span> do pedido.</p>
          )}
        </label>
        
        <label className={`block border rounded-md p-4 cursor-pointer ${selectedPayment === 'card' ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="radio" name="payment" value="card" checked={selectedPayment === 'card'} onChange={() => setSelectedPayment('card')} className="w-4 h-4 accent-orange-500" />
              <div className="ml-3 text-sm">
                <span className="font-bold">CARTÃO DE CRÉDITO</span>
              </div>
            </div>
            <FaCreditCard className="text-gray-500" size={20} />
          </div>
        </label>

        <label className={`block border rounded-md p-4 cursor-pointer ${selectedPayment === 'nupay' ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="radio" name="payment" value="nupay" checked={selectedPayment === 'nupay'} onChange={() => setSelectedPayment('nupay')} className="w-4 h-4 accent-orange-500" />
              <div className="ml-3 text-sm">
                <span className="font-bold">NUPAY</span>
              </div>
            </div>
            <SiNubank className="text-gray-500" size={20} />
          </div>
        </label>
      </div>
    </div>
  );
}