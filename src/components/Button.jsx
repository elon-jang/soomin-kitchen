import React from 'react';
import { cn } from '../utils/cn'; // We need to create this utility or just use template literals if simple

// Implementing a simple class merger inline for now to avoid extra files if not needed, 
// but standard practice is a utility. I'll use template literals for simplicity here 
// or I can create the utility. Let's create the utility first actually.

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyles = "px-6 py-3 rounded-none font-medium text-sm tracking-wide uppercase transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-white hover:bg-gray-800",
        secondary: "bg-white text-primary border border-primary hover:bg-gray-50",
        outline: "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white",
        ghost: "bg-transparent text-primary hover:bg-gray-100",
        danger: "bg-accent text-white hover:bg-red-700"
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
