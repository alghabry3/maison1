import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-brand-ivory transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          {
            'bg-brand-brown text-white hover:bg-brand-brown/90': variant === 'primary',
            'bg-brand-black text-brand-ivory hover:bg-brand-black/90': variant === 'secondary',
            'border border-brand-brown/20 bg-transparent hover:bg-brand-brown/5 text-brand-brown': variant === 'outline',
            'hover:bg-brand-brown/10 text-brand-brown': variant === 'ghost',
            'bg-brand-gold text-brand-black hover:bg-brand-gold/90': variant === 'gold',
            
            'h-9 px-4 py-2': size === 'sm',
            'h-11 px-6 py-2': size === 'md',
            'h-14 px-8 text-base': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
