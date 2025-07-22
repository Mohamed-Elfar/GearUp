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
          ? `${props.customClasses} fw-bold rounded transition-all`
          : "btn btn-primary fw-bold rounded-3 px-4 py-2"
      }`}
      type="button"
    >
      {props.label}
    </button>
  );
}
