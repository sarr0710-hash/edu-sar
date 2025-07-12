import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Mic, FileText, Search, Award, Settings } from 'lucide-react';
import WalletConnect from './WalletConnect';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/issue', label: 'Issue Certificate', icon: FileText },
    { path: '/verify', label: 'Verify', icon: Search },
    { path: '/my-certificates', label: 'My Certificates', icon: Award },
    { path: '/voice-agent', label: 'Voice Agent', icon: Mic },
    { path: '/admin', label: 'Admin Dashboard', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <Shield className="w-8 h-8 text-purple-400" />
              <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-sm"></div>
            </div>
            <span className="text-xl font-bold text-white">EduCred</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'text-slate-300 hover:text-purple-400 hover:bg-slate-800/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Wallet Connect */}
          <div className="hidden md:flex items-center">
            <WalletConnect />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'text-slate-300 hover:text-purple-400 hover:bg-slate-800/50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-slate-800">
                <WalletConnect />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;