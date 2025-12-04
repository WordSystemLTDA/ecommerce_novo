/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  FaCheckCircle,
  FaQrcode,
  FaRegCopy,
  FaExclamationCircle,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaTruck,
  FaCreditCard,
  FaCheck
} from 'react-icons/fa';
import QRCode from 'react-qr-code';
import Footer from '~/components/footer';
import Header from '~/components/header';

const CheckoutStepper = ({ activeStep }: { activeStep: number }) => {
  const steps = [
    { name: 'Carrinho', icon: FaShoppingCart },
    { name: 'Endereço', icon: FaMapMarkerAlt },
    { name: 'Entrega', icon: FaTruck },
    { name: 'Pagamento', icon: FaCreditCard },
    { name: 'Confirmação', icon: FaCheckCircle },
    { name: 'Concluído', icon: FaCheckCircle },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center py-4 px-2 overflow-x-auto whitespace-nowrap">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === activeStep;
          const isCompleted = stepNumber < activeStep;

          return (
            <React.Fragment key={step.name}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 
                    ${isActive ? 'border-orange-500 bg-orange-500 text-white' : ''}
                    ${isCompleted ? 'border-orange-500 bg-white text-orange-500' : ''}
                    ${!isActive && !isCompleted ? 'border-gray-300 text-gray-400' : ''}
                  `}
                >
                  {isCompleted ? <FaCheck size={20} /> : <step.icon size={20} />}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium 
                    ${(isActive || isCompleted) ? 'text-orange-500' : 'text-gray-400'}
                  `}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-auto h-0.5 mx-2 ${(isCompleted || isActive) ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const Step6_Success = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-green-700">PEDIDO REALIZADO COM SUCESSO!</h1>
        <p className="text-lg text-gray-600">AGORA É SÓ REALIZAR O PAGAMENTO</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col items-center">
          <div className="w-64 h-64 border-4 border-gray-300 rounded-lg mx-auto flex items-center justify-center bg-white">
            <QRCode
              value="asdoskaodksakodsaoidoi1j23u12932199asdasijdjadojsadoijasdoi1oi23joi12j3i21o3i21io"
              className="p-2 w-full h-full"
            />
          </div>

          <button
            className="mt-4 w-64 bg-orange-500 text-white font-bold py-3 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            onClick={() => {
              navigator.clipboard.writeText('asdoskaodksakodsaoidoi1j23u12932199asdasijdjadojsadoijasdoi1oi23joi12j3i21o3i21io')
            }}

          >
            <FaRegCopy /> COPIAR CÓDIGO PIX
          </button>
        </div>

        <div className="flex-1">
          <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-md flex items-start gap-3 mb-6">
            <FaExclamationCircle className="text-2xl mt-1" />
            <div>
              <p className="font-bold">Aproveite! Este código tem validade de 12 horas.</p>
              <p className="text-sm">Ao realizar o pagamento você será informado por e-mail.</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-sm text-gray-600">O número do seu pedido é:</p>
            <p className="text-5xl font-bold text-gray-800 tracking-wider">46294872</p>
          </div>

          <p className="text-sm text-gray-600 mb-4">Escaneie o <span className="font-bold">QR Code</span> ou copie o <span className="font-bold">código PIX</span>. Abra o app da instituição que você possui o PIX cadastrado e realize o pagamento.</p>

          <h3 className="font-bold text-lg text-gray-800 mb-3">Como pagar seu Pix</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p className="flex items-center gap-2"><FaQrcode className="text-xl text-orange-500" /> Utilize o aplicativo do seu banco copiando o código PIX ou escaneando o QR-Code.</p>
            <p className="flex items-center gap-2"><FaCheckCircle className="text-sm text-orange-500" /> Confirme os dados de pagamento e o valor do seu pedido.</p>
            <p className="flex items-center gap-2"><FaCheckCircle className="text-xl text-orange-500" /> Seu pagamento será processado e debitado do valor disponível em sua conta-corrente.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default function OrderSuccessPage() {
  return (
    <div>
      <Header />

      <div className="bg-gray-100 min-h-screen py-8">
        <div className="max-w-387 mx-auto px-4">

          <div className="bg-white rounded-lg shadow-sm mb-6">
            <CheckoutStepper activeStep={6} />
          </div>

          <Step6_Success />

        </div>
      </div>

      <Footer />
    </div>
  );
}