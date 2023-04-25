import React from "react";
import "../wave.component.css";

function Wave() {
  return (
    <div className="relative h-20">
      <div className="absolute bottom-0 left-0 w-full h-5 bg-blue-500"></div>
      <div className="absolute bottom-0 left-0 w-full h-4 bg-blue-400 animate-wave"></div>
      <div className="absolute bottom-0 left-0 w-full h-3 bg-blue-300 animate-wave"></div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 animate-wave"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-100 animate-wave"></div>
    </div>
  );
}

export default Wave;
