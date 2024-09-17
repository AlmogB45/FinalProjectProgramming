import React from 'react';
import { categoryLabels } from '../utils/CategoryLabels';
import '../CSS/TagSelector.css';

const TagSelector = ({ category, selectedTags, onTagToggle }) => {
  const tags = categoryLabels[category] || [];

  return (
    <div className="tag-selector">
      {tags.map(tag => (
        <button
          key={tag}
          className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
          onClick={() => onTagToggle(tag)}
          disabled={selectedTags.length >= 5 && !selectedTags.includes(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagSelector;