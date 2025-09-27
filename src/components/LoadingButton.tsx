import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from './ui/utils';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      className={cn(
        "relative transition-all duration-200",
        loading && "cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      
      <span className={cn(loading && "opacity-0")}>
        {loading && loadingText ? loadingText : children}
      </span>
    </Button>
  );
}