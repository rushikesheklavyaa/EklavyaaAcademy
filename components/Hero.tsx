
import React from 'react';
import { Star, Zap } from 'lucide-react';
import Button from './ui/Button';

interface HeroProps {
  onOpenEnquiry: () => void;
  onOpenRevision: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenEnquiry, onOpenRevision }) => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-white text-secondary-900">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid z-0 opacity-60"></div>
      
      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        
        {/* Branding Title */}
        <div className="mb-14 flex flex-col items-center justify-center text-center animate-fade-in-up">
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-3 flex flex-wrap justify-center gap-x-3 md:gap-x-4">
                <span className="text-secondary-900">Eklavyaa</span> 
                <span className="text-primary-500 italic">Academy</span>
             </h1>
             <p className="text-[0.45rem] md:text-[0.65rem] font-bold text-slate-400 tracking-[0.6em] md:tracking-[0.8em] uppercase ml-[0.6em] md:ml-[0.8em]">
                Aim . Learn . Achieve
             </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left Column: Text */}
            <div className="text-center md:text-left animate-fade-in-up animate-delay-100 order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-200 shadow-sm rounded-full px-4 py-1.5 mb-6 mx-auto md:mx-0">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-yellow-800 tracking-wide uppercase">
                        Felicitation Ceremony 2026
                    </span>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-secondary-900 leading-tight mb-4 font-bold">
                  Celebrating the Pride of Success – <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-amber-500">Board Toppers 2026</span> 🌟
                </h2>
                
                <p className="text-sm md:text-base text-slate-600 mb-4 leading-relaxed max-w-lg mx-auto md:mx-0 font-medium">
                  Congratulations to all our brilliant SSC (10th) and HSC (12th) students for their outstanding board results! We are proud to honor your hard work and achievements.
                </p>

                <p className="text-sm md:text-base text-slate-500 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                  Students who have successfully passed the 2026 Board Examinations are invited to register for the grand felicitation event. Fill out the registration form below to confirm your seat.
                </p>
                
                {/* REPLACED BUTTONS SECTION */}
                <div className="flex flex-col sm:flex-row items-center md:justify-start justify-center gap-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="rounded-full px-8 py-4 w-full sm:w-auto hover:-translate-y-1 transition-transform shadow-xl shadow-primary-500/20 flex items-center gap-2 relative overflow-hidden group bg-gradient-to-r from-blue-600 to-primary-600 text-white"
                    onClick={onOpenRevision}
                  >
                    <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></span>
                    <span>✅ Register Now</span>
                  </Button>
                </div>
                <p className="mt-3 text-xs text-slate-400 font-medium">
                  * For SSC (10th) & HSC (12th) Board Toppers 2026
                </p>
            </div>

            {/* Right Column: Hero Image with Floating Animation */}
            <div className="relative animate-fade-in-up animate-delay-200 order-1 md:order-2">
                <div className="animate-float">
                  <div className="absolute inset-0 bg-primary-500 rounded-2xl rotate-2 opacity-10 transform translate-x-3 translate-y-3"></div>
                  <img 
                      src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                      alt="Classroom Excellence" 
                      className="relative z-10 rounded-2xl shadow-2xl w-full object-cover aspect-[1.4/1] border-4 border-white"
                  />
                  
                  {/* Floating Result Badge */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 z-20 hidden lg:block animate-pulse-slow">
                      <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                              <Star className="w-5 h-5 text-green-600 fill-current" />
                          </div>
                          <div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Board Results</p>
                              <p className="font-bold text-lg text-secondary-900">100% Pass Rate</p>
                          </div>
                      </div>
                  </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
