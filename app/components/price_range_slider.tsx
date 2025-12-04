import React, { useState } from 'react';
import RangeSlider from 'react-range-slider-input';
import { currencyFormatter } from '~/utils/formatters';

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  onChange?: (min: number, max: number) => void;
}

export function PriceRangeSlider({ min = 2.87, max = 89093.72, onChange }: PriceRangeSliderProps) {

  const [values, setValues] = useState<[number, number]>([min, max]);

  const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newMin = Number(event.target.value);

    if (isNaN(newMin) || newMin < min) {
      newMin = min;
    }
    if (newMin >= values[1]) {
      newMin = values[1] - 1;
    }

    setValues([newMin, values[1]]);
  };

  const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newMax = Number(event.target.value);

    if (isNaN(newMax) || newMax > max) {
      newMax = max;
    }
    if (newMax <= values[0]) {
      newMax = values[0] + 1;
    }

    setValues([values[0], newMax]);
  };

  return (
    <div className="p-0">

      <div className="text-xs text-gray-500 mb-2">Intervalo de Preço</div>

      <RangeSlider
        min={min}
        max={max}
        step={0.01}
        value={values}

        onInput={(newValues: [number, number]) => {
          setValues(newValues);
          if (onChange) onChange(newValues[0], newValues[1]);
        }}

        className="w-full h-4 mb-1"
        id="range-slider-custom"
      />

      <div className="flex justify-between text-xs text-gray-600 mt-2 mb-4">
        <span>{currencyFormatter.format(values[0])}</span>
        <span>{currencyFormatter.format(values[1])}</span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder={`Mínimo - R$ ${Math.floor(min)}`}
          value={values[0].toFixed(2)}
          onChange={handleMinInputChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />

        <span className="text-gray-400">-</span>

        <input
          type="number"
          placeholder={`Máximo - R$ ${Math.ceil(max)}`}
          value={values[1].toFixed(2)}
          onChange={handleMaxInputChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </div>
    </div>
  );
}