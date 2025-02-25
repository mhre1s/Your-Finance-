import React from 'react';
import {Menu, X, Sun, Moon} from 'lucide-react'

const Header = () => {
  return (
    <>
    <header className='flex justify-between py-4 border-b-1 border-solid border-slate-200 shadow-md shadow-slate-500'>
        <button className='hover:cursor-pointer hover:bg-slate-100 duration-300 border-1 border-slate-200 border-solid rounded-md ml-8'>
            <Menu size={32}/>
        </button>
        <h1 className='text-2xl'>Your Finance$</h1>
        <button className=' mr-8 hover:cursor-pointer hover:text-yellow-500 duration-300'>
            <Sun size={32}/>
        </button>
    </header>
    </>
  )
}

export default Header