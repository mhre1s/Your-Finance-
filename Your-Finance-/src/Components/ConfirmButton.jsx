import React from 'react';

const ConfirmButton = ({ className = '', onClick, children, disabled = false, type = 'button' }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 transition-colors shadow-xs cursor-pointer ${className}`}
    >
      {children || 'Confirmar'}
    </button>
  );
};

export default ConfirmButton;
