import Jumbotron from '@components/jumbotron/Jumbotron'

import { useState } from 'react'

function Homepage() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Jumbotron />
      <div className="tray">
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          content
        </div>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  )
}

export default Homepage
