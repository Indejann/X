'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showDiscordWindow, setShowDiscordWindow] = useState(false)
  const [showNotepad, setShowNotepad] = useState(true)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a150a] via-[#0a0a0a] to-[#0a100a] flex flex-col items-center overflow-hidden">
      <div className="liquid-animation"></div>
      
      <div className="w-full flex justify-end p-4 space-x-4">
        <a 
          href="https://chat.openai.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group relative overflow-hidden bg-gradient-to-r from-emerald-950 to-gray-900 text-gray-300 px-8 py-4 rounded-lg text-2xl hover:scale-105 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-800 to-gray-700 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
          <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">AI</div>
        </a>
        <a 
          href="https://www.youtube.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group relative overflow-hidden bg-gradient-to-r from-red-950 to-gray-900 text-gray-300 px-8 py-4 rounded-lg text-2xl hover:scale-105 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-gray-700 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
          <div className="relative z-10 group-hover:translate-x-2 transition-transform duration-300">YT</div>
        </a>
      </div>

      <div className="clock text-7xl text-gray-400 mt-8">
        {format(currentTime.getHours())} {format(currentTime.getMinutes())}
      </div>

      <div className="search-container mt-16 mb-8 w-full max-w-4xl px-4">
        <input 
          ref={searchInputRef}
          type="text" 
          placeholder="Suche..." 
          className="w-full py-4 px-6 text-2xl rounded-full bg-[#1a1a1a] bg-opacity-50 text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all duration-300"
        />
      </div>

      <div className="flex space-x-4 mb-8">
        <button 
          onClick={() => setShowDiscordWindow(true)}
          className="bg-[#1a1a1a] bg-opacity-50 text-gray-300 px-6 py-3 rounded-lg hover:bg-opacity-70 transition-all duration-300"
        >
          Discord
        </button>
      </div>

      {showNotepad && (
        <WindowWidget 
          title=""
          onClose={() => setShowNotepad(false)}
          initialPosition={{ x: 20, y: 20 }}
        >
          <textarea 
            className="w-64 h-32 bg-transparent text-gray-300 resize-none focus:outline-none"
            placeholder="Notizen hier eingeben..."
          />
        </WindowWidget>
      )}

      {showDiscordWindow && (
        <WindowWidget 
          title="Discord" 
          onClose={() => setShowDiscordWindow(false)}
          initialPosition={{ x: window.innerWidth / 4, y: window.innerHeight / 4 }}
        >
          <iframe
            src="https://discord.com/login"
            className="w-full h-[600px]"
            title="Discord Login"
          />
        </WindowWidget>
      )}
    </div>
  )
}

function format(num: number): string {
  return num.toString().padStart(2, '0')
}

interface WindowWidgetProps {
  title: string
  children: React.ReactNode
  onClose: () => void
  initialPosition: { x: number; y: number }
}

function WindowWidget({ title, children, onClose, initialPosition }: WindowWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [position, setPosition] = useState(initialPosition)

  const handleDrag = (event: any, info: { point: { x: number; y: number } }) => {
    setPosition(info.point)
  }

  return (
    <motion.div 
      className={`fixed bg-[#1a1a1a] bg-opacity-80 backdrop-blur-lg rounded-lg shadow-2xl border border-gray-800 ${
        isFullscreen ? 'w-full h-full' : 'w-auto'
      }`}
      style={{ 
        x: isFullscreen ? 0 : position.x,
        y: isFullscreen ? 0 : position.y,
      }}
      drag={!isFullscreen}
      dragMomentum={false}
      onDrag={handleDrag}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="flex justify-between items-center p-2 border-b border-gray-800 cursor-move">
        <h2 className="text-gray-400 font-medium">{title}</h2>
        <div className="flex space-x-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="text-gray-400 hover:text-gray-200 transition-colors">
            −
          </button>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="text-gray-400 hover:text-gray-200 transition-colors">
            {isFullscreen ? '❐' : '□'}
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors">
            ×
          </button>
        </div>
      </div>
      {!isMinimized && (
        <div className="overflow-hidden" style={{ height: isFullscreen ? 'calc(100vh - 36px)' : 'auto' }}>
          {children}
        </div>
      )}
    </motion.div>
  )
}

