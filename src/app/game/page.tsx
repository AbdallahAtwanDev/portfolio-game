'use client'
import dynamic from 'next/dynamic'
import React from 'react'

const GameCanvas = dynamic(() => import('./GameCanvas'), { ssr: false })

export default function GamePage() {
  return (
    <main className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl mb-4">Portfolio Game — Abdullah</h1>
      <p className="mb-4 text-sm text-gray-300">جرب تحرك بالدزر/أسهم أو WASD</p>
      <GameCanvas />
    </main>
  )
}
