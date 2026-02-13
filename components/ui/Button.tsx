import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 shadow-lg shadow-primary-500/30",
    secondary: "bg-secondary-900 hover:bg-secondary-800 text-white focus:ring-secondary-900 shadow-lg shadow-secondary-900/20",
    outline: "border-2 border-secondary-900 text-secondary-900 hover:bg-secondary-900 hover:text-white focus:ring-secondary-900",
    white: "bg-white text-secondary-900 hover:bg-slate-100 focus:ring-white shadow-lg",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;