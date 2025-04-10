import React from 'react'

const ConfirmButton = ({className = '',onClick, children}) => {
  return (
    <>
      <button onClick={onClick} className={`p-2 rounded-lg cursor-pointer 
      hover:brightness-150 duration-300 dark:bg-green-700 ${className || 'bg-green-500 '}`}>{children || 'Confirmar'}</button>
    </>
  )
}

export default ConfirmButton
