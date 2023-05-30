import React, { useRef, useState } from "react";
import "./Button.css";

const Button = ({ children }) => {
  const [UIButtonTimeoutID, setUIButtonTimeoutID] = useState(null);
  const buttonRef = useRef(null);
  const animateButton = (e) => {
    clearTimeout(UIButtonTimeoutID);
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;

    buttonRef.current.style.setProperty("--circle-pos-x", `${x}px`);
    buttonRef.current.style.setProperty("--circle-pos-y", `${y}px`);

    buttonRef.current.classList.add("clicked");
    setUIButtonTimeoutID(setTimeout(() => {
      buttonRef.current.classList.remove("clicked");
    }, 500));
  };

  return (
    <button
      class="ui-button"
      id="ui-button"
      tabindex="0"
      ref={buttonRef}
      onMouseDown={animateButton}
    >
      {children}
    </button>
  );
};

export default Button;
