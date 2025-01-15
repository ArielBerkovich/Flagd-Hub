import React from 'react';
import './flags-empty-state.css';  // Import the CSS file

// Truncate and append "..." if longer than 10 characters
const trimSearchTerm = (term: string): string => {
  if (!term) return ''; 
  term = term.trim(); 
  return term.length > 20 ? term.substring(0, 20) + '...' : term; 
};

interface FlagsEmptyStateProps {
  searchTerm: string;
}

const FlagsEmptyState: React.FC<FlagsEmptyStateProps> = ({ searchTerm }) => {
  const trimmedSearchTerm = trimSearchTerm(searchTerm);

  return (
    <div className="no-feature-flags-container">
      <div className="no-feature-flags-icon">
        <svg
          width="100"
          height="auto"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="10" cy="10" r="7" />
          <line x1="16" y1="16" x2="20" y2="20" />
        </svg>
      </div>
      <h2 className="no-feature-flags-title">
        No Feature Flags found for "{trimmedSearchTerm}"
      </h2>
    </div>
  );
};

export default FlagsEmptyState;
