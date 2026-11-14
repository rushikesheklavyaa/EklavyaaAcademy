import React from 'react';
import { useIntersectionObserver } from '../../utils/useIntersectionObserver';

interface RevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  className?: string;
  duration?: number;
  width?: 'fit-content' | '100%';
}

const DELAY_CLASS_MAP: Record<number, string> = {
  0: 'delay-0',
  75: 'delay-75',
  100: 'delay-100',
  150: 'delay-150',
  200: 'delay-200',
  250: 'delay-[250ms]',
  300: 'delay-300',
  350: 'delay-[350ms]',
  400: 'delay-[400ms]',
  450: 'delay-[450ms]',
  500: 'delay-500',
};

const DURATION_CLASS_MAP: Record<number, string> = {
  300: 'duration-300',
  500: 'duration-500',
  700: 'duration-700',
  800: 'duration-700',
  1000: 'duration-1000',
};

export const Reveal: React.FC<RevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  duration = 700,
  width = '100%',
}) => {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px',
  });

  const hiddenTransformMap: Record<NonNullable<RevealProps['direction']>, string> = {
    up: 'translate-y-4',
    down: '-translate-y-4',
    left: '-translate-x-4',
    right: 'translate-x-4',
    none: 'translate-y-0',
  };

  const delayClass = DELAY_CLASS_MAP[delay] ?? 'delay-0';
  const durationClass = DURATION_CLASS_MAP[duration] ?? 'duration-700';
  const widthClass = width === 'fit-content' ? 'w-fit' : 'w-full';

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] ease-out ${durationClass} ${delayClass} ${widthClass} ${
        isVisible
          ? 'opacity-100 translate-x-0 translate-y-0'
          : `opacity-0 ${hiddenTransformMap[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Reveal;