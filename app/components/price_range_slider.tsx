import React, { useState } from 'react';
// 1. Importe o componente da nova biblioteca
import RangeSlider from 'react-range-slider-input';

// 2. IMPORTANTE: Importe o CSS base da biblioteca
// Sem isso, o slider ficará invisível
import 'react-range-slider-input/dist/style.css';
import '../app.css';

// --- Constantes baseadas na sua imagem ---
const MIN_PRICE = 2.87;
const MAX_PRICE = 89093.72;

// Formata R$ 1234.5 para "R$ 1.234,50"
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/**
 * Componente de Slider de Intervalo de Preço
 * * Requer: `npm install react-range-slider-input --legacy-peer-deps`
 * * Requer: `import 'react-range-slider-input/dist/style.css';`
 */
export function PriceRangeSlider() {
  
  // O estado 'values' guarda um array [min, max]
  const [values, setValues] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);

  // Handler para quando os inputs de texto mudam
  const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newMin = Number(event.target.value);
    
    // Validação
    if (isNaN(newMin) || newMin < MIN_PRICE) {
      newMin = MIN_PRICE;
    }
    if (newMin >= values[1]) {
      newMin = values[1] - 1; 
    }
    
    setValues([newMin, values[1]]);
  };

  const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newMax = Number(event.target.value);

    // Validação
    if (isNaN(newMax) || newMax > MAX_PRICE) {
      newMax = MAX_PRICE;
    }
    if (newMax <= values[0]) {
      newMax = values[0] + 1;
    }
    
    setValues([values[0], newMax]);
  };

  return (
    <div className="p-0">
      
      {/* 4. Título "Intervalo de Preço" (Tailwind) */}
      <div className="text-xs text-gray-500 mb-2">Intervalo de Preço</div>

      {/* 5. O Componente Slider */}
      <RangeSlider
        min={MIN_PRICE}
        max={MAX_PRICE}
        step={0.01}
        value={values}

        onInput={setValues} // 'onInput' atualiza o estado
        
        // Classe do container principal (para espaçamento)
        className="w-full h-4 mb-1" 
        id="range-slider-custom"
      />

      {/* 6. Labels de Preço (R$ 2,87 ... R$ 89.093,72) (Tailwind) */}
      <div className="flex justify-between text-xs text-gray-600 mt-2 mb-4">
        <span>{currencyFormatter.format(values[0])}</span>
        <span>{currencyFormatter.format(values[1])}</span>
      </div>

      {/* 7. Inputs de Texto (Mínimo / Máximo) (Tailwind) */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder={`Mínimo - R$ ${Math.floor(MIN_PRICE)}`}
          value={values[0].toFixed(2)} // Controla o valor
          onChange={handleMinInputChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
        
        <span className="text-gray-400">-</span>
        
        <input
          type="number"
          placeholder={`Máximo - R$ ${Math.ceil(MAX_PRICE)}`}
          value={values[1].toFixed(2)} // Controla o valor
          onChange={handleMaxInputChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </div>
    </div>
  );
}