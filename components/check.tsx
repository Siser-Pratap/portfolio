import React from 'react'

const Check = () => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-black'>
      <h1>Click me</h1>
      <button onClick={()=>alert('clicked')}>Click me</button>
    </div>
  )
}

export default Check
