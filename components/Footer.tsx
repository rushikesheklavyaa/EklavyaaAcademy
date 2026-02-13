import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer id="contact" className="bg-secondary-900 text-white pt-16 pb-8 border-t border-secondary-800">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
             <div className="flex flex-col items-start gap-4">
                 <div className="bg-white p-3 rounded-xl inline-block">
                    <Logo className="h-16 w-auto" />
                 </div>
                 <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide">Eklavyaa</span>
                      <span className="text-xl md:text-2xl font-serif font-bold italic text-primary-500 tracking-wide">Academy</span>
                    </div>
                    <p className="text-[0.5rem] font-bold text-slate-400 tracking-[0.4em] mt-1 uppercase">Aim Learn Achieve</p>
                 </div>
             </div>
             <p className="text-slate-400 text-sm leading-relaxed">
               Empowering students with knowledge, discipline, and the self-belief to achieve their dreams. Join us to transform Aim into Achievement.
             </p>
             <div className="flex gap-4 pt-2">
                <a href="#" className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center text-slate-300 hover:bg-[#1877F2] hover:text-white transition-colors" title="Facebook">
                    <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/eklavyaa_academy_official?igsh=MWl1b29wNzF6bDl1ZA==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center text-slate-300 hover:bg-[#E4405F] hover:text-white transition-colors" title="Instagram">
                    <Instagram className="w-5 h-5" />
                </a>
             </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <a href="#about" onClick={(e) => scrollToSection(e, '#about')} className="hover:text-primary-400 transition-colors inline-block">About Us</a>
                </li>
                <li>
                  <a href="#courses" onClick={(e) => scrollToSection(e, '#courses')} className="hover:text-primary-400 transition-colors inline-block">Courses Offered</a>
                </li>
                <li>
                  <a href="#features" onClick={(e) => scrollToSection(e, '#features')} className="hover:text-primary-400 transition-colors inline-block">Why Choose Us</a>
                </li>
                <li>
                  <a href="#methodology" onClick={(e) => scrollToSection(e, '#methodology')} className="hover:text-primary-400 transition-colors inline-block">Methodology</a>
                </li>
                <li>
                  <a href="#enquiry" onClick={(e) => scrollToSection(e, '#enquiry')} className="hover:text-primary-400 transition-colors inline-block">Admissions</a>
                </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <span>Eklavyaa Academy, Bungalow No. 1, Raje Chowk, Ambegaon Pathar, Pune - 411046</span>
                </li>
                <li className="flex flex-col gap-3">
                    <a href="tel:9011141618" className="flex items-center gap-3 hover:text-primary-400 transition-colors group">
                        <Phone className="w-5 h-5 text-primary-500 shrink-0 group-hover:text-primary-400" />
                        <span>9011141618</span>
                    </a>
                    <a href="tel:9022781871" className="flex items-center gap-3 hover:text-primary-400 transition-colors group">
                        <Phone className="w-5 h-5 text-primary-500 shrink-0 group-hover:text-primary-400" />
                        <span>9022781871</span>
                    </a>
                    <a href="tel:7666076709" className="flex items-center gap-3 hover:text-primary-400 transition-colors group">
                        <Phone className="w-5 h-5 text-primary-500 shrink-0 group-hover:text-primary-400" />
                        <span>7666076709</span>
                    </a>
                </li>
                <li>
                    <a href="mailto:enquiry.eklavyaa@gmail.com" className="flex items-center gap-3 hover:text-primary-400 transition-colors break-all group">
                        <Mail className="w-5 h-5 text-primary-500 shrink-0 group-hover:text-primary-400" />
                        <span>enquiry.eklavyaa@gmail.com</span>
                    </a>
                </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-800 pt-8 text-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Eklavyaa Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;