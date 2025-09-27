import { useState, forwardRef } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from './ui/utils';

interface FormInputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    id, 
    name, 
    type = 'text', 
    label, 
    value, 
    onChange, 
    onBlur,
    error, 
    touched, 
    placeholder,
    required = false,
    disabled = false,
    className,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    const hasError = touched && error;

    return (
      <div className={cn("space-y-2", className)}>
        <Label 
          htmlFor={id} 
          className={cn(
            "text-sm font-medium transition-colors",
            hasError ? "text-destructive" : "text-gray-700"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={hasError ? `${id}-error` : undefined}
            className={cn(
              "w-full h-12 px-4 transition-all duration-200",
              "bg-gray-50 border-0 rounded-lg",
              "focus:bg-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-0",
              "placeholder:text-gray-400",
              hasError && "ring-2 ring-destructive focus:ring-destructive",
              disabled && "opacity-50 cursor-not-allowed",
              (isPassword || hasError) && "pr-12"
            )}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute top-1/2 -translate-y-1/2",
                "p-1 rounded-md transition-colors",
                "text-gray-500 hover:text-gray-700",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                hasError ? "right-10" : "right-3"
              )}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          
          {hasError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          )}
        </div>
        
        {hasError && (
          <p 
            id={`${id}-error`}
            className="text-sm text-destructive flex items-center gap-1 mt-1"
            role="alert"
          >
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';