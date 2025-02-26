import React, { useState } from 'react';
import {Menu, X, Sun, Moon} from 'lucide-react'

const Header = () => {
  const [theme, setTheme] = useState('light')
  const changeTheme = (e)=>{
    e.preventDefault()
    if(theme === 'light'){
      document.documentElement.classList.add('dark')
      setTheme('dark')
    }
    else{
      document.documentElement.classList.remove('dark')
      setTheme('light')
    }
  }
  return (
    <>
    <header className='dark:bg-gray-950 dark:text-white dark:border-slate-700 flex justify-between py-4 border-b-1 border-solid border-slate-200 shadow-md shadow-slate-500'>
        <button className='hover:cursor-pointer hover:bg-slate-100 duration-300 border-1 border-slate-200 border-solid rounded-md ml-8 dark:hover:bg-slate-700'>
            <Menu size={28}/>
        </button>
        <h1 className='text-2xl'>Your Finance$</h1>
        <button onClick={changeTheme} className=' mr-8 hover:cursor-pointer hover:text-yellow-500 duration-300'>
          {theme === 'light' ? <Moon className='animate-slideLeft' size={32}/> : <Sun className='animate-slideLeft' size={32}/>}
            
        </button>
    </header>
    </>
  )
}

export default Header