import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md'
}) => {
  const sizes = {
    sm: {
      switch: 'w-8 h-5',
      thumb: 'w-3.5 h-3.5',
      translate: 'translate-x-3.5'
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'w-4 h-4',
      translate: 'translate-x-5'
    },
    lg: {
      switch: 'w-14 h-7',
      thumb: 'w-5 h-5',
      translate: 'translate-x-7'
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`
        relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2
        focus-visible:ring-bs-primary focus-visible:ring-opacity-50
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${checked ? 'bg-bs-primary' : 'bg-bs-100'}
        ${sizes[size].switch}
      `}
    >
      <span className="sr-only">Toggle</span>
      <span
        className={`
          pointer-events-none inline-block transform rounded-full bg-white shadow-lg
          ring-0 transition duration-200 ease-in-out
          ${checked ? sizes[size].translate : 'translate-x-0.5'}
          ${sizes[size].thumb}
        `}
      />
    </button>
  );
};