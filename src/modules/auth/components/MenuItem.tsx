import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  isLoading?: boolean;
}

export const MenuItem = React.memo(forwardRef<HTMLAnchorElement | HTMLButtonElement, MenuItemProps>(
  ({ icon: Icon, label, onClick, href, variant = 'default', disabled, isLoading }, ref) => {
    const baseStyles = "flex items-center gap-3 px-4 py-2 text-sm menu-transition menu-item";
    const variantStyles = {
      default: "text-bs-navy hover:bg-bs-50",
      danger: "text-red-600 hover:bg-red-50"
    };

    const content = (
      <>
        <span className="menu-item-icon">
          <Icon className="w-4 h-4" />
        </span>
        <span className="flex-1">{isLoading ? `${label}...` : label}</span>
        {isLoading && (
          <div className="absolute inset-0 bg-current opacity-10 menu-loading" />
        )}
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
          className={`${baseStyles} ${variantStyles[variant]}`}
          role="menuitem"
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.RefObject<HTMLButtonElement>}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} w-full text-left relative overflow-hidden
                   disabled:opacity-50 disabled:cursor-not-allowed`}
        role="menuitem"
      >
        {content}
      </button>
    );
  }
));

MenuItem.displayName = 'MenuItem';