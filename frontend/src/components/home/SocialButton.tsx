import React from 'react';

interface SocialButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ 
  href, 
  icon, 
  label, 
  className = '' 
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`social-button ${className}`}
      aria-label={label}
    >
      {icon}
    </a>
  );
};

export default SocialButton;
