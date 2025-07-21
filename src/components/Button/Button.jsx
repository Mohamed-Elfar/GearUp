import React from "react";

export default function Button(props) {
  const customStyles = {};
  if (props.color && !props.customClasses) {
    customStyles.color = props.color;
  }
  if (props.padding) {
    customStyles.padding = props.padding;
  }
  return (
    <button
      onClick={props.handleClick}
      style={customStyles}
      className={`${
        props.customClasses
          ? `${props.customClasses} font-bold rounded transition-colors duration-200`
          : "bg-primary-500 text-white font-bold rounded hover:bg-primary-700 transition-colors duration-200 px-6 py-3"
      }`}
    >
      {props.label}
    </button>
  );
}
