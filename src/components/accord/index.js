import React, { useState, useRef, useEffect } from "react";
import "./style.css";

const AccordionDynamicHeight = ({
  body,
  header,
  headerOpen,
  classes = { header: "", body: "" },
  defaultOpened = false,
}) => {
  const contentRef = useRef(null);
  const [isOpen, setIsOpen] = useState(defaultOpened || false);
  const [contentHeight, setContentHeight] = useState(
    defaultOpened ? contentRef?.current?.scrollHeight : 0
  );

  useEffect(() => {
    setContentHeight(contentRef?.current?.scrollHeight);
  }, [isOpen, defaultOpened, contentRef?.current?.scrollHeight]);

  useEffect(() => {
    const handleResize = () => {
      setContentHeight(contentRef?.current?.scrollHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [contentRef?.current?.scrollHeight]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`accordion-container ${isOpen ? "open" : ""}`}>
      <div
        ref={contentRef}
        className="accordion-content"
        style={{ height: isOpen ? contentHeight + "px" : 0 }}
      >
        <div className={`accord-body ${classes.body}`}>{body}</div>
      </div>

      <div
        aria-hidden
        onClick={toggleAccordion}
        className={`accordion-header ${classes.header}`}
      >
        {isOpen ? headerOpen || header : header}
      </div>
    </div>
  );
};

export default AccordionDynamicHeight;
