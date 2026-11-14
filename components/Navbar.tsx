import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './ui/Button';
import Logo from './Logo';
import { CoursePageTabId } from '../types';

interface NavbarProps {
  onOpenEnquiry: () => void;
  onNavigateHome: () => void;
  onNavigateTab: (tabId: CoursePageTabId) => void;
  onNavigateDownloads: () => void;
  onNavigateAdmin?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onOpenEnquiry,
  onNavigateHome,
  onNavigateTab,
  onNavigateDownloads,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (tabId: CoursePageTabId) => {
    onNavigateTab(tabId);
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2 md:py-3' : 'bg-white py-4 md:py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between gap-8">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group whitespace-nowrap shrink-0"
          >
            <Logo className="h-9 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
            <span className="text-xl md:text-2xl font-bold text-secondary-900 leading-none tracking-tight">
              Eklavyaa <span className="text-primary-500">Academy</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-7">
            <button
              type="button"
              onClick={() => handleTabClick('esat')}
              className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 transition-colors whitespace-nowrap shrink-0"
            >
              E-SAT Entrance Exam
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('finish-line')}
              className="text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors whitespace-nowrap shrink-0"
            >
              Finish Line 30 - Crash Course
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigateDownloads();
                setIsOpen(false);
              }}
              className="text-sm font-medium text-slate-600 hover:text-secondary-900 transition-colors whitespace-nowrap shrink-0"
            >
              Downloads
            </button>
          </div>

          <div className="hidden md:flex items-center shrink-0">
            <Button
              variant="secondary"
              size="md"
              className="rounded-xl px-5 py-2.5 text-sm whitespace-nowrap shrink-0"
              onClick={onOpenEnquiry}
            >
              Enroll Now
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-secondary-900 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => handleTabClick('esat')}
            className="text-base font-bold text-center text-indigo-700 py-1"
          >
            E-SAT Entrance Exam
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('finish-line')}
            className="text-base font-bold text-center text-secondary-900 py-1"
          >
            Finish Line 30 - Crash Course
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigateDownloads();
              setIsOpen(false);
            }}
            className="text-base font-medium text-center text-slate-800 py-1"
          >
            Downloads
          </button>
          <Button
            className="w-full rounded-xl py-3.5 mt-2"
            onClick={() => {
              setIsOpen(false);
              onOpenEnquiry();
            }}
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
