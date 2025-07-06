import { useStore } from '../store/useStore';
import apiService from '../services/api';

/**
 * Custom hook for standardized error handling across the application
 * Automatically shows snackbar notifications for errors
 */
export const useErrorHandler = () => {
  const { notification } = useStore();

  const handleError = (error: any, customMessage?: string) => {
    const errorMessage = customMessage || apiService.handleError(error);
    notification.show(errorMessage, 'error');
    console.error('Error occurred:', error);
  };

  const handleSuccess = (message: string) => {
    notification.show(message, 'success');
  };

  const handleWarning = (message: string) => {
    notification.show(message, 'warning');
  };

  const handleInfo = (message: string) => {
    notification.show(message, 'info');
  };

  return {
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo,
  };
};

/**
 * Utility function to validate form fields and show validation errors
 * Returns true if form is valid, false otherwise
 */
export const validateForm = (
  fields: Record<string, any>,
  validationRules: Record<string, (value: any) => string | null>,
  setValidationErrors: (errors: Record<string, string>) => void
): boolean => {
  const errors: Record<string, string> = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const value = fields[field];
    const error = validationRules[field](value);
    
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  setValidationErrors(errors);
  return isValid;
};

/**
 * Common validation rules
 */
export const validationRules = {
  required: (value: any, fieldName: string) => 
    !value || !value.toString().trim() ? `${fieldName} is required` : null,
  
  email: (value: string) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'Please enter a valid email address' : null;
  },
  
  minLength: (value: string, min: number, fieldName: string) =>
    value && value.length < min ? `${fieldName} must be at least ${min} characters` : null,
  
  maxLength: (value: string, max: number, fieldName: string) =>
    value && value.length > max ? `${fieldName} must be at most ${max} characters` : null,
  
  password: (value: string) => {
    if (!value) return null;
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  },
  
  confirmPassword: (password: string, confirmPassword: string) =>
    password !== confirmPassword ? 'Passwords do not match' : null,
  
  phone: (value: string) => {
    if (!value) return null;
    const phoneRegex = /^[0-9]{10}$/;
    return !phoneRegex.test(value) ? 'Please enter a valid 10-digit phone number' : null;
  },
  
  amount: (value: string, min: number = 0, max: number = 999999) => {
    if (!value) return null;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Please enter a valid amount';
    if (numValue < min) return `Amount must be at least ₹${min}`;
    if (numValue > max) return `Amount cannot exceed ₹${max}`;
    return null;
  },
  
  age: (value: string) => {
    if (!value) return null;
    const age = parseInt(value);
    if (isNaN(age) || age < 18 || age > 100) return 'Age must be between 18 and 100';
    return null;
  },
  
  otp: (value: string) => {
    if (!value) return 'Please enter the OTP';
    if (value.length !== 6) return 'OTP must be 6 digits';
    return null;
  },
}; 