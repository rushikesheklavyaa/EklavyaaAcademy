import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <img
      src="https://lh3.googleusercontent.com/d/1lRmsiphZwpRj6swox8OH0iy2ruST2iZV"
      alt="Eklavyaa Academy Logo"
      className={`object-contain ${className}`}
      referrerPolicy="no-referrer"
    />
  );
};

export default Logo;