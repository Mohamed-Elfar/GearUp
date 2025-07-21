import React from "react";
import styles from "./Button.module.css";

export default function Button(props) {
  const {
    label,
    handleClick,
    variant = "primary",
    size = "medium",
    fullWidth = false,
    disabled = false,
    customClasses = "",
    color,
    padding,
    ...otherProps
  } = props;

  const customStyles = {};
  if (color && !customClasses) {
    customStyles.color = color;
  }
  if (padding) {
    customStyles.padding = padding;
  }

  // Build className
  const buttonClasses = [
    styles.button,
    customClasses ? styles.custom : styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    disabled ? styles.disabled : "",
    customClasses,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      onClick={handleClick}
      style={customStyles}
      className={buttonClasses}
      disabled={disabled}
      {...otherProps}
    >
      {label}
    </button>
  );
}
