import React, { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  bg?: 'white' | 'light' | 'dark';
}

const Section: React.FC<SectionProps> = ({ id, className = '', children, bg = 'white' }) => {
  const bgClasses = {
    white: 'bg-white',
    light: 'bg-slate-50',
    dark: 'bg-secondary-900 text-white',
  };

  return (
    <section id={id} className={`py-16 md:py-24 ${bgClasses[bg]} ${className}`}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {children}
      </div>
    </section>
  );
};

export default Section;