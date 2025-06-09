import React from 'react';

interface LoadingClapperProps {
  className?: string;
}

const LoadingClapper: React.FC<LoadingClapperProps> = ({ className = '' }) => {
  const basePath = process.env.NODE_ENV === 'production' ? '/michaeltugsjack' : '';
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative w-16 h-16 animate-spin">
        <img
          src={`${basePath}/images/loading-cat.svg`}
          alt="Loading..."
          className="w-16 h-16"
        />
        <span className="sr-only">Loading content...</span>
      </div>
    </div>
  );
};

export default LoadingClapper; 