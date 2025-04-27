import { FC } from "react";

interface HeaderProps {
  onInfoClick: () => void;
}

const Header: FC<HeaderProps> = ({ onInfoClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 py-3 px-4 fixed top-0 w-full z-10">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h1 className="text-xl font-semibold text-gray-800">HealthChat<span className="text-primary font-bold">AI</span></h1>
        </div>
        <button 
          onClick={onInfoClick}
          className="text-gray-500 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-1 transition-colors"
          aria-label="Information about AWS architecture"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
