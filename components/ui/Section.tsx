import React, { ReactNode } from 'react';
import { useIntersectionObserver } from '../../utils/useIntersectionObserver';

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  bg?: 'white' | 'light' | 'dark';
  animateOnScroll?: boolean;
}

const Section: React.FC<SectionProps> = ({
  id,
  className = '',
  children,
  bg = 'white',
  animateOnScroll = true,
}) => {
  const { ref, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.01,
    rootMargin: '0px 0px -30px 0px',
  });

  const bgClasses = {
    white: 'bg-white',
    light: 'bg-slate-50',
    dark: 'bg-secondary-900 text-white',
  };

  const revealClasses = animateOnScroll
    ? `transition-[opacity,transform] duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`
    : '';

  return (
    <section
      ref={ref}
      id={id}
      className={`py-16 md:py-24 ${bgClasses[bg]} ${revealClasses} ${className}`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">{children}</div>
    </section>
  );
};

export default Section;