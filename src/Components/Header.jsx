import React, { useEffect, useState } from 'react';
import {Menu, BarChart, LayoutDashboard, Coins, PlusCircle} from 'lucide-react'
import { XMarkIcon } from '@heroicons/react/24/solid';
import { RiMoonClearFill, RiSunFill} from 'react-icons/ri';
import { NavLink } from 'react-router';



const Header = () => {
  
  const [theme, setTheme] = useState(localStorage.getItem('theme' || 'light'))
  const [sideBar, setSideBar] = useState(false)

  useEffect(()=>{
    if(theme === 'light'){
      document.documentElement.classList.add('dark')
    }

    else{
      document.documentElement.classList.remove('dark')
    }

    localStorage.setItem('theme', theme)
  },[theme])

  const changeTheme = (e)=>{
    e.preventDefault()
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
  const handleSideBar = () =>{
    if(!sideBar){
    setSideBar(true)
    
  }
  else{
    setSideBar(false)
  }
  }
  return (
    <>
    <header className='dark:bg-gray-950 dark:shadow-slate-800 dark:text-white dark:border-slate-700 flex justify-between py-4 border-b-1 border-solid border-slate-200 shadow-md shadow-slate-500'>
        <aside className={`w-full sm:w-64 absolute gap-14 flex flex-col top-0 left-0 h-screen dark:bg-slate-800 dark:border-slate-700 bg-gray-100 border-1 border-solid 
          border-slate-200 ${sideBar ? `block`: `hidden`}`}>
          <div className='w-full flex justify-end'>
            <button onClick={handleSideBar} className='m-3 cursor-pointer'><XMarkIcon className="h-6 w-6 hover:rounded-4xl text-red-400 dark:hover:bg-amber-50 duration-500 hover:bg-slate-400"/></button>
          </div>
          <ol className='flex flex-col gap-5 items-center'>
            <li className='flex items-center gap-2'><LayoutDashboard size={20}/><NavLink to='/' className={({isActive})=>
            isActive ? 'text-sky-300' : ''}>Dashboards</NavLink></li>
            <li className='flex items-center gap-2'><BarChart size={20} /><NavLink to='/graphics' className={({isActive})=>
            isActive ? 'text-sky-300' : ''}>Gráficos</NavLink></li>
            <li className='flex items-center gap-2'><Coins size={20}/><NavLink className={({isActive})=>
            isActive ? 'text-sky-300' : ''} to='/transactions'>Transações</NavLink></li>
            <li className='flex items-center gap-2'><PlusCircle size={20}/><NavLink  to='/newtransaction' className={({isActive})=>
            isActive ? 'text-sky-300' : ''}>Adicionar Transação</NavLink></li>
          </ol>
        </aside>
        <button onClick={handleSideBar} className='hover:cursor-pointer hover:rounded-md hover:bg-slate-100 duration-300 ml-8 dark:hover:bg-slate-800'>
            <Menu size={28}/>
        </button>
        <h1 className='text-2xl'>Your Finance<span className='text-green-800'>$</span></h1>
        <button onClick={changeTheme} className=' mr-8 hover:cursor-pointer hover:text-yellow-500 duration-300'>
          {theme === 'light' ? <RiMoonClearFill  className='animate-slideLeft' size={25}/> : <RiSunFill  className='animate-slideLeft' size={25}/>}
        </button>
    </header>
    </>
  )
}

export default Header