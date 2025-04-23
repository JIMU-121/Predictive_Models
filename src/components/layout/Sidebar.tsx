import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  HomeIcon, 
  TrendingUp, 
  Users, 
  Heart, 
  Menu, 
  X
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={twMerge(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close button */}
        <button 
          className="absolute top-4 right-4 p-1 rounded-md text-gray-500 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">DataScience</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <NavItem to="/" icon={<HomeIcon size={20} />} label="Dashboard" />
          <NavItem to="/property" icon={<TrendingUp size={20} />} label="Property Price" />
          <NavItem to="/churn" icon={<Users size={20} />} label="Customer Churn" />
          <NavItem to="/disease" icon={<Heart size={20} />} label="Disease Detection" />
        </nav>
      </div>
    </>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        twMerge(
          "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "bg-primary-50 text-primary-600"
            : "text-gray-700 hover:bg-gray-100"
        )
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

export default Sidebar;