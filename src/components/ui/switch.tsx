import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '../../lib/utils';

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
      root: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    md: {
      root: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    lg: {
      root: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7'
    }
  };

  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onChange}
      disabled={disabled}
      className={cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
        'transition-colors duration-200 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bs-primary focus-visible:ring-offset-2',
        'data-[state=checked]:bg-bs-primary data-[state=unchecked]:bg-bs-200',
        'hover:data-[state=checked]:bg-bs-primary/90 hover:data-[state=unchecked]:bg-bs-300',
        disabled && 'cursor-not-allowed opacity-50',
        sizes[size].root
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block rounded-full bg-white shadow-lg ring-0',
          'transition-transform duration-200 ease-in-out',
          'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5',
          sizes[size].thumb
        )}
      />
    </SwitchPrimitive.Root>
  );
};