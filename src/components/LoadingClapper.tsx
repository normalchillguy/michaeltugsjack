import React from 'react';

interface LoadingClapperProps {
  className?: string;
}

const LoadingClapper: React.FC<LoadingClapperProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative w-24 h-24">
        {/* Base of the clapper */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-[#E5A00D] rounded-md" />
        
        {/* Top part of the clapper that animates */}
        <div className="absolute inset-x-0 top-4 h-8 bg-[#E5A00D] rounded-md origin-top animate-clap">
          {/* The diagonal line */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-1 bg-black transform -rotate-12" />
          </div>
        </div>
        
        {/* Screen reader text */}
        <span className="sr-only">Loading content...</span>
      </div>
    </div>
  );
};

export default LoadingClapper; 