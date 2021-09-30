import { FC, MouseEvent, ReactElement } from "react";

interface ButtonProps {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactElement;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

export const Button: FC<ButtonProps> = ({
  children,
  loading = false,
  disabled,
  className = "",
  leftIcon,
  ...props
}) => {
  disabled = disabled || loading;

  return (
    <button
      disabled={disabled}
      className={`rounded-lg flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-gradient-to-r from-indigo-400  to-green-500 focus:outline-none shadow-md 
			${className} ${
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "transform hover:-translate-y-px focus:shadow-sm focus:-translate-y-0"
      }
			`}
      {...props}
    >
      {!disabled && !loading && leftIcon}
      {disabled && !loading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      )}
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-white mr-1"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
