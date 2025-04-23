import React from 'react';
import { Menu } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  title: string;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ title, setIsMobileOpen }) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button
          type="button"
          className="lg:hidden mr-4 text-gray-500 hover:text-gray-600"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          Documentation
        </Button>
      </div>
    </header>
  );
};

export default Header;