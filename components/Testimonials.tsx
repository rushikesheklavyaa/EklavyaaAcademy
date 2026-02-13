import React from 'react';
import Section from './ui/Section';
import { Quote } from 'lucide-react';
import { Testimonial } from '../types';
import Reveal from './ui/Reveal';

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Aditya Sharma",
    role: "10th Std Student (CBSE)",
    content: "The concept clarity I got here helped me score 95% in Maths. The teachers are very supportive and never hesitated to clear my doubts.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 2,
    name: "Mrs. Rajeshwari Patil",
    role: "Parent",
    content: "I have seen a remarkable change in my son's discipline. Eklavyaa Academy not only focuses on marks but also on the student's overall attitude.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 3,
    name: "Sneha Gupta",
    role: "12th Std Student (Science)",
    content: "The test series was a game changer. It helped me manage my time during the actual Board exam. Highly recommended.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80"
  }
];

const Testimonials: React.FC = () => {
  return (
    <Section id="testimonials" bg="light">
      <Reveal>
        <div className="text-center mb-16">
          <h2 className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-2">Testimonials</h2>
          <h3 className="text-4xl font-serif font-bold text-secondary-900">What Our Family Says</h3>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((item, index) => (
          <Reveal key={item.id} delay={index * 150} direction="up" className="h-full">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 relative h-full border border-slate-100 group">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary-100 group-hover:text-primary-200 transition-colors" />
              <div className="flex items-center gap-4 mb-6">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary-100" />
                  <div>
                      <h5 className="font-bold text-secondary-900 leading-tight">{item.name}</h5>
                      <span className="text-xs text-slate-500 font-medium">{item.role}</span>
                  </div>
              </div>
              <p className="text-slate-600 italic leading-relaxed">"{item.content}"</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

export default Testimonials;