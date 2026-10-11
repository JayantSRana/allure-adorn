import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-8 py-3 text-sm tracking-wider transition-all',
        variant === 'primary' && 'bg-brand-burgundy text-white hover:bg-opacity-90',
        variant === 'secondary' && 'border border-brand-burgundy text-brand-burgundy hover:bg-brand-burgundy hover:text-white',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
