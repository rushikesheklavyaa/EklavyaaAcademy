import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './ui/Button';
import Logo from './Logo';

interface NavbarProps {
  onOpenEnquiry: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenEnquiry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Handle background style
      setIsScrolled(window.scrollY > 10);

      // Handle active section
      const sections = ['about', 'courses', 'methodology', 'features'];
      let current = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Courses', href: '#courses', id: 'courses' },
    { name: 'Methodology', href: '#methodology', id: 'methodology' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setIsOpen(false);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-2 md:py-3' 
          : 'bg-white py-4 md:py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* Left: Logo & Text Branding */}
          <a href="#" className="flex items-center gap-2 md:gap-3 group">
             <Logo className="h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105" />
             <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-serif font-bold text-secondary-900 leading-none">Eklavyaa</span>
                  <span className="text-xl md:text-2xl font-serif font-bold italic text-primary-500 leading-none">Academy</span>
                </div>
                <span className="text-[0.5rem] md:text-[0.6rem] font-bold text-slate-400 tracking-[0.4em] mt-1 uppercase">Aim Learn Achieve</span>
             </div>
          </a>

          {/* Right: Navigation & CTA */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`text-sm font-medium transition-all duration-300 relative group ${
                  activeSection === link.id ? 'text-primary-600' : 'text-slate-600 hover:text-secondary-900'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-500 transition-all duration-300 ${
                  activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </a>
            ))}
            <Button 
              variant="secondary" 
              size="md" 
              className="rounded-full px-6 shadow-xl shadow-secondary-900/10 hover:-translate-y-1 transition-transform"
              onClick={onOpenEnquiry}
            >
               Enroll Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-secondary-900 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-6 flex flex-col gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-lg font-medium text-center transition-colors ${
                activeSection === link.id ? 'text-primary-600' : 'text-slate-800'
              }`}
              onClick={(e) => scrollToSection(e, link.href)}
            >
              {link.name}
            </a>
          ))}
          <Button 
            className="w-full rounded-full py-4"
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