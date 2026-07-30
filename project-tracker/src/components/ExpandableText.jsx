import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const ExpandableText = ({ text = '', year = '', maxLength = 80, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  if (!text) return null;

  const isLong = text.length > maxLength;
  const yearSuffix = year ? ` (${year})` : '';

  if (!isLong) {
    return <span className={className}>{text}{yearSuffix}</span>;
  }

  const truncated = text.slice(0, maxLength).trim();

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <span className={className}>
      <span 
        onClick={handleToggle}
        className="cursor-pointer hover:text-emerald-700 transition-colors"
        title={isExpanded ? "Click to collapse" : "Click to expand"}
      >
        {isExpanded ? text : `${truncated}...`}{yearSuffix}
      </span>
      <button 
        type="button"
        onClick={handleToggle}
        className="ml-1.5 text-xs text-emerald-600 font-normal hover:underline inline-flex items-center cursor-pointer focus:outline-none"
      >
        {isExpanded ? `(${t('showLess') || 'less'})` : `(${t('showMore') || 'more...'})`}
      </button>
    </span>
  );
};

export default ExpandableText;
