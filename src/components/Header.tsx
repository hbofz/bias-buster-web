
import React from 'react';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex h-14 items-center">
        <div className="mr-4 font-bold text-primary">
          <span className="hidden md:inline">BiasBuster</span>
          <span className="md:hidden">BB</span>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <a href="#overview" className="transition-colors hover:text-primary">Overview</a>
          <a href="#case-studies" className="transition-colors hover:text-primary">Case Studies</a>
          <a href="#simulation" className="transition-colors hover:text-primary">Simulation</a>
          <a href="#solutions" className="transition-colors hover:text-primary">Solutions</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
