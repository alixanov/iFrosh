/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import './style.css';

const AccordionDynamicHeight = ({ body,header }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    setContentHeight(contentRef?.current?.scrollHeight);
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setContentHeight(contentRef?.current?.scrollHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [contentRef?.current?.scrollHeight]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`accordion-container ${isOpen ? 'open' : ''}`}>
      <div ref={contentRef} className="accordion-content" style={{ height: isOpen ? contentHeight + 'px' : 0 }}>
        <div className="accord-body">{body}</div>
      </div>

      <div aria-hidden onClick={toggleAccordion} className="accordion-header">
        {header}
      </div>
    </div>
  );
};

export default AccordionDynamicHeight;
