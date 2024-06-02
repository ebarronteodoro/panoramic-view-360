import React, { useState } from 'react'
import ChevronLeftIcon from '../icons/ChevronLefttIcon'

const AsideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleTouchStart = () => {
    toggleSidebar()
  }

  return (
    <aside className={`aside-bar ${isOpen ? 'open' : 'closed'}`}>
      <div className='content-asidebar'>
        {children}
        <div className='close-button' onClick={toggleSidebar} onTouchStart={handleTouchStart}>
          <ChevronLeftIcon width='45' height='45' />
        </div>
      </div>
    </aside>
  )
}

export default AsideBar
