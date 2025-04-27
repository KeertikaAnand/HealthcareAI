import { FC } from "react";

interface ErrorToastProps {
  message: string | null;
  isVisible: boolean;
}

const ErrorToast: FC<ErrorToastProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-md flex items-center z-50 max-w-md animate-in fade-in slide-in-from-bottom duration-300">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{message || "An error occurred. Please try again."}</span>
    </div>
  );
};

export default ErrorToast;
