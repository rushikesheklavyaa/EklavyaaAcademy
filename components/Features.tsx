import React from 'react';
import Section from './ui/Section';
import { Users, Lightbulb, ClipboardCheck, MessageCircle, Compass, Sparkles } from 'lucide-react';
import { Feature } from '../types';
import Reveal from './ui/Reveal';

const features: Feature[] = [
  {
    title: 'Experienced Faculty',
    description: 'Mentors with years of experience who understand student psychology and exam patterns.',
    icon: Users,
  },
  {
    title: 'Concept-Based Teaching',
    description: 'We move beyond memorization. We ensure the "Why" and "How" are understood clearly.',
    icon: Lightbulb,
  },
  {
    title: 'Test Series & Analytics',
    description: 'Regular chapter-wise tests and full-length mock exams with detailed performance analysis.',
    icon: ClipboardCheck,
  },
  {
    title: 'Personalized Mentoring',
    description: 'Individual attention to every student to identify strengths and work on weaknesses.',
    icon: Sparkles,
  },
  {
    title: 'Regular PTMs',
    description: 'Consistent interaction with parents to keep them updated on their child\'s progress.',
    icon: MessageCircle,
  },
  {
    title: 'Career Counselling',
    description: 'Expert guidance to help students choose the right career path and competitive exams.',
    icon: Compass,
  },
];

const Features: React.FC = () => {
  return (
    <Section id="features" bg="white">
       <Reveal>
         <div className="text-center max-w-3xl mx-auto mb-16">
           <h2 className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-2">Why Choose Us</h2>
           <h3 className="text-4xl md:text-5xl font-serif font-bold text-secondary-900 mb-6">
             The Eklavyaa <span className="text-primary-500 font-serif italic">Advantage</span>
           </h3>
           <p className="text-slate-600 text-lg">
             Success is not an accident. It is the result of right habits, right guidance, and consistent effort. Here is how we ensure your child succeeds.
           </p>
         </div>
       </Reveal>
       
       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Reveal key={idx} delay={idx * 100} direction="up" className="h-full">
              <div className="flex flex-col gap-6 p-8 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 border border-slate-100 h-full group hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 text-primary-600 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-sm">
                      <feature.icon className="w-8 h-8" />
                  </div>
                  <div>
                      <h4 className="font-bold text-secondary-900 text-xl mb-3 group-hover:text-primary-600 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                        {feature.description}
                      </p>
                  </div>
              </div>
            </Reveal>
          ))}
       </div>
    </Section>
  );
};

export default Features;