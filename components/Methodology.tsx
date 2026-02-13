import React from 'react';
import Section from './ui/Section';
import { Target, Brain, Trophy, ArrowRight, ArrowDown } from 'lucide-react';
import Reveal from './ui/Reveal';

const Methodology: React.FC = () => {
  return (
    <Section id="methodology" bg="dark" className="relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-secondary-800 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary-600 rounded-full blur-3xl opacity-20"></div>

      <Reveal>
        <div className="relative z-10 text-center mb-16">
          <h2 className="text-primary-400 font-bold tracking-wider uppercase text-sm mb-2">Our Methodology</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            The Path to <span className="text-primary-400 font-serif italic">Excellence</span>
          </h3>
        </div>
      </Reveal>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            {/* Step 1: AIM */}
            <Reveal delay={100} direction="up" className="w-full md:w-auto">
              <div className="flex flex-col items-center text-center group w-full">
                  <div className="w-24 h-24 rounded-full bg-secondary-800 border-4 border-secondary-700 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(14,165,233,0.1)] group-hover:border-primary-500 group-hover:scale-110 transition-all duration-300">
                      <Target className="w-10 h-10 text-primary-400 group-hover:text-primary-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">AIM</h4>
                  <p className="text-slate-300 text-sm max-w-[200px] mx-auto">
                      Set clear, ambitious goals. Understand the syllabus and exam pattern thoroughly.
                  </p>
              </div>
            </Reveal>

            {/* Connector */}
            <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-secondary-700 via-primary-500/50 to-secondary-700 relative opacity-50">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary-900 p-2 rounded-full border border-secondary-700">
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                 </div>
            </div>
            <div className="md:hidden">
                <ArrowDown className="w-6 h-6 text-slate-500 animate-bounce" />
            </div>

            {/* Step 2: LEARN */}
            <Reveal delay={300} direction="up" className="w-full md:w-auto">
              <div className="flex flex-col items-center text-center group w-full">
                  <div className="w-24 h-24 rounded-full bg-secondary-800 border-4 border-secondary-700 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(14,165,233,0.1)] group-hover:border-primary-500 group-hover:scale-110 transition-all duration-300">
                      <Brain className="w-10 h-10 text-primary-400 group-hover:text-primary-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">LEARN</h4>
                  <p className="text-slate-300 text-sm max-w-[200px] mx-auto">
                      Deep dive into concepts. Discipline in attendance and practice. Ask doubts freely.
                  </p>
              </div>
            </Reveal>

            {/* Connector */}
            <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-secondary-700 via-primary-500/50 to-secondary-700 relative opacity-50">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary-900 p-2 rounded-full border border-secondary-700">
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                 </div>
            </div>
            <div className="md:hidden">
                <ArrowDown className="w-6 h-6 text-slate-500 animate-bounce" />
            </div>

            {/* Step 3: ACHIEVE */}
            <Reveal delay={500} direction="up" className="w-full md:w-auto">
              <div className="flex flex-col items-center text-center group w-full">
                  <div className="w-24 h-24 rounded-full bg-secondary-800 border-4 border-secondary-700 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(14,165,233,0.1)] group-hover:border-primary-500 group-hover:scale-110 transition-all duration-300">
                      <Trophy className="w-10 h-10 text-primary-400 group-hover:text-primary-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">ACHIEVE</h4>
                  <p className="text-slate-300 text-sm max-w-[200px] mx-auto">
                      Excel in exams. Build confidence. Reach your full potential and celebrate success.
                  </p>
              </div>
            </Reveal>
        </div>
      </div>
    </Section>
  );
};

export default Methodology;