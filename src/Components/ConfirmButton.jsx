import React from 'react'

const ConfirmButton = ({className = '',onClick, children}) => {
  return (
    <>
      <button onClick={onClick} className={`p-2 rounded-lg cursor-pointer 
      hover:brightness-150 duration-300 ${className || 'bg-green-700 '}`}>{children || 'Confirmar'}</button>
    </>
  )
}

export default ConfirmButton
