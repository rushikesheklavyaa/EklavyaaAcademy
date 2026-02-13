import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  className?: string;
  duration?: number;
  width?: 'fit-content' | '100%';
}

export const Reveal: React.FC<RevealProps> = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  className = '', 
  duration = 800,
  width = '100%' 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(50px)';
      case 'down': return 'translateY(-50px)';
      case 'left': return 'translateX(-50px)';
      case 'right': return 'translateX(50px)';
      case 'none': return 'none';
      default: return 'none';
    }
  };

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate(0, 0)' : getTransform(),
    transition: `all ${duration}ms cubic-bezier(0.5, 0, 0, 1) ${delay}ms`,
    width
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
};

export default Reveal;