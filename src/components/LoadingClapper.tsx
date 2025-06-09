import React from 'react';
import Image from 'next/image';

interface LoadingClapperProps {
  className?: string;
}

const LoadingClapper: React.FC<LoadingClapperProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative w-16 h-16 animate-spin">
        <Image
          src="/images/loading-cat.svg"
          alt="Loading..."
          width={64}
          height={64}
          className="w-16 h-16"
        />
        <span className="sr-only">Loading content...</span>
      </div>
    </div>
  );
};

export default LoadingClapper; 