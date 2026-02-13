import React from 'react';
import Section from './ui/Section';
import { Target, Heart } from 'lucide-react';
import Reveal from './ui/Reveal';

const About: React.FC = () => {
  return (
    <Section id="about" bg="white">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Reveal delay={100}>
            <h2 className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-2">About Us</h2>
          </Reveal>
          
          <Reveal delay={200}>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-secondary-900 mb-6">
              The Spirit of <span className="text-primary-500">Self-Belief</span>
            </h3>
          </Reveal>
          
          <Reveal delay={300}>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
              <p>
                <strong>EKLAVYAA ACADEMY</strong> is built on the foundational values of the legendary archer Eklavya, who proved that with unwavering focus (Ekagrata) and dedication (Shraddha) any goal can be achieved.
              </p>
              <p>
                We believe that every student has the potential to excel if guided with the right methodology and disciplined practice. Unlike conventional coaching that focuses solely on rote learning, we prioritize <strong>Concept Clarity</strong> and <strong>Self-Analysis</strong>.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
             <Reveal direction="up" delay={400} className="h-full">
               <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 h-full hover:shadow-md transition-all duration-300">
                  <div className="p-3 bg-secondary-100 text-secondary-900 rounded-xl mb-4">
                      <Target className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-secondary-900 text-lg mb-2">Laser-Sharp Focus</h4>
                  <p className="text-slate-600">Distraction-free environment encouraging deep learning and unwavering concentration.</p>
               </div>
             </Reveal>
             
             <Reveal direction="up" delay={500} className="h-full">
               <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 h-full hover:shadow-md transition-all duration-300">
                  <div className="p-3 bg-primary-100 text-primary-600 rounded-xl mb-4">
                      <Heart className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-secondary-900 text-lg mb-2">Personal Attention</h4>
                  <p className="text-slate-600">We treat every student's dream as our own responsibility, providing individual mentorship.</p>
               </div>
             </Reveal>
        </div>
      </div>
    </Section>
  );
};

export default About;