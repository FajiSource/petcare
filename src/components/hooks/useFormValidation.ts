import { useState, useCallback } from 'react';

interface ValidationRules {
  required?: boolean;
  email?: boolean;
  minLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface FieldConfig {
  [key: string]: ValidationRules;
}

interface FormErrors {
  [key: string]: string;
}

export function useFormValidation(config: FieldConfig) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = useCallback((name: string, value: string): string => {
    const rules = config[name];
    if (!rules) return '';

    if (rules.required && !value.trim()) {
      return 'This field is required';
    }

    if (rules.email && value && !isValidEmail(value)) {
      return 'Please enter a valid email address';
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return 'Invalid format';
    }

    if (rules.custom && value) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return '';
  }, [config]);

  const validateForm = useCallback((formData: { [key: string]: string }): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(config).forEach(field => {
      const error = validateField(field, formData[field] || '');
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [config, validateField]);

  const validateSingleField = useCallback((name: string, value: string) => {
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    return error === '';
  }, [validateField]);

  const markFieldTouched = useCallback((name: string) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    validateForm,
    validateSingleField,
    markFieldTouched,
    clearErrors
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}