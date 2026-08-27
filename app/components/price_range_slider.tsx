import React, { useState, useEffect } from 'react';
import RangeSlider from 'react-range-slider-input';
import { currencyFormatter } from '~/utils/formatters';

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  minVal?: number;
  maxVal?: number;
  onChange?: (min: number, max: number) => void;
}

export function PriceRangeSlider({ min = 2.87, max = 89093.72, minVal, maxVal, onChange }: PriceRangeSliderProps) {

  const [values, setValues] = useState<[number, number]>([minVal ?? min, maxVal ?? max]);

  useEffect(() => {
    setValues([minVal ?? min, maxVal ?? max]);
  }, [max, maxVal, min, minVal]);

  const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newMin = Number(event.target.value);
    // Allow typing, validation happens on commit
    const newValues: [number, number] = [newMin, values[1]];
    setValues(newValues);
  };

  const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newMax = Number(event.target.value);
    // Allow typing, validation happens on commit
    const newValues: [number, number] = [values[0], newMax];
    setValues(newValues);
  };

  const commitChanges = () => {
    let [newMin, newMax] = values;

    // Validation logic
    if (isNaN(newMin) || newMin < min) newMin = min;
    if (isNaN(newMax) || newMax > max) newMax = max;

    // Ensure min <= max
    if (newMin > newMax) {
      // If they crossed, swap or clamp? 
      // Usually clamp min to max or max to min.
      // Let's just ensure they are valid bounds.
      // If user typed min > max, maybe swap?
      // Simple approach: clamp min to max-1 or similar if strictly enforced, 
      // but here we just want to ensure valid range.
      // Let's just pass what we have if valid numbers, 
      // but the slider might behave weirdly if min > max.
      // Let's enforce min <= max.
      if (newMin > newMax) newMin = newMax;
    }

    // Update state with validated values
    setValues([newMin, newMax]);

    // Notify parent
    if (onChange) onChange(newMin, newMax);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      commitChanges();
    }
  };

  return (
    <div className="p-0">

      <div className="mb-3 text-xs text-primary/55">Intervalo de preço</div>

      <RangeSlider
        min={min}
        max={max}
        step={0.01}
        value={values}

        onInput={(newValues: [number, number]) => {
          setValues(newValues);
        }}

        onThumbDragEnd={() => {
          if (onChange) onChange(values[0], values[1]);
        }}

        className="w-full h-4 mb-1"
        id="range-slider-custom"
      />

      <div className="mb-4 mt-2 flex justify-between text-xs text-primary/65">
        <span>{currencyFormatter.format(values[0])}</span>
        <span>{currencyFormatter.format(values[1])}</span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          aria-label="Preço mínimo"
          placeholder={`Mínimo - R$ ${Math.floor(min)}`}
          value={values[0]}
          onChange={handleMinInputChange}
          onBlur={commitChanges}
          onKeyDown={handleKeyDown}
          className="min-w-0 w-full border border-primary/15 bg-main-bg p-2 text-xs text-primary outline-none focus:border-terciary"
        />

        <span className="text-primary/35">–</span>

        <input
          type="number"
          aria-label="Preço máximo"
          placeholder={`Máximo - R$ ${Math.ceil(max)}`}
          value={values[1]}
          onChange={handleMaxInputChange}
          onBlur={commitChanges}
          onKeyDown={handleKeyDown}
          className="min-w-0 w-full border border-primary/15 bg-main-bg p-2 text-xs text-primary outline-none focus:border-terciary"
        />
      </div>
    </div>
  );
}
