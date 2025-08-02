import React, { useState, ReactNode } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: TooltipPosition;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, position = "bottom" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses: Record<TooltipPosition, string> = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute ${positionClasses[position]} z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;