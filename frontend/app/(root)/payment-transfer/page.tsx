"use client"

import { useState } from 'react'
import '@/app/globals.css'
import SwapInterface from '@/components/avnu/AVNU'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <SwapInterface />
    </>
  )
}

export default App
