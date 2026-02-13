import React from 'react';
import Section from './ui/Section';
import { Book, GraduationCap, Microscope, Briefcase } from 'lucide-react';
import { Course } from '../types';
import Reveal from './ui/Reveal';

const courses: Course[] = [
  {
    id: 'foundation',
    title: 'School Foundation',
    grades: 'Class 5th - 7th',
    boards: 'SSC / CBSE',
    description: 'Building strong roots in Mathematics and Science fundamentals ensuring a smooth transition to higher grades.',
    icon: Book,
    image: 'https://images.unsplash.com/photo-1488751045188-3c55bbf9a3fa?auto=format&fit=crop&w=600&q=80',
    color: 'border-blue-500',
  },
  {
    id: 'secondary',
    title: 'Secondary Excellence',
    grades: 'Class 8th - 10th',
    boards: 'SSC / CBSE',
    description: 'Intensive preparation for Board exams with focus on answer writing skills, concept application, and regular testing.',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80',
    color: 'border-emerald-500',
  },
  {
    id: 'science',
    title: 'Science',
    grades: 'Class 11th - 12th',
    boards: 'PCMB / JEE / NEET',
    description: 'Comprehensive coaching for Physics, Chemistry, Maths/Biology (PCMB) with entrance exam orientation.',
    icon: Microscope,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    color: 'border-orange-500',
  },
  {
    id: 'commerce',
    title: 'Commerce',
    grades: 'Class 11th - 12th',
    boards: 'Accounts / Economics',
    description: 'Expert guidance in Accounts, Economics, and Business Studies to master financial concepts.',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    color: 'border-purple-500',
  },
];

const Courses: React.FC = () => {
  const getIconColorClass = (id: string) => {
    switch (id) {
      case 'foundation': return 'bg-blue-100 text-blue-600';
      case 'secondary': return 'bg-emerald-100 text-emerald-600';
      case 'science': return 'bg-orange-100 text-orange-600';
      case 'commerce': return 'bg-purple-100 text-purple-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <Section id="courses" bg="light">
      <Reveal>
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex flex-col items-center">
            <h2 className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-2">
              Our Academic Tracks
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-secondary-900 mb-6">
              Excellence Across All <span className="text-primary-500 font-serif italic">Streams</span>
            </h3>
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              We offer comprehensive coaching programs tailored to different educational milestones, ensuring a strong foundation and competitive edge.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <Reveal key={course.id} delay={index * 150} direction="up" className="h-full">
            <div className={`h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 ${course.color} group cursor-default flex flex-col`}>
              {/* Image Area with Badge Overlays as seen in reference */}
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Floating Top-Left Icon */}
                <div className={`absolute top-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover:-translate-y-1 ${getIconColorClass(course.id)}`}>
                  <course.icon className="w-6 h-6" />
                </div>

                {/* Bottom-Right Board Pill */}
                <div className="absolute bottom-4 right-4">
                  <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/20 uppercase tracking-widest shadow-lg">
                    {course.boards}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-7 flex flex-col flex-grow">
                <h4 className="text-2xl font-serif font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {course.title}
                </h4>
                
                <p className="text-primary-500 font-bold text-sm mb-4">
                  {course.grades}
                </p>

                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">
                  {course.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

export default Courses;