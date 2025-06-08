import React from 'react'
import Features from './components/Features'
import Introduction from './components/Introduction'
import data from './data/data.json'

const LandingPage = () => {
  return (
    <div>
      <Introduction introData={data.Introduction} />
      <Features features={data.Features} />
    </div>
  )
}

export default LandingPage