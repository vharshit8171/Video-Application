import React from 'react'
import FuzzyText from '../components/FuzzyText.jsx';

const NotFound = () => {
  return (
    <div className='h-screen flex-col gap-5 flex justify-center items-center'>
      <FuzzyText
        baseIntensity={0.2}
        hoverIntensity={0.5}
        enableHover>
        404
      </FuzzyText>
      <FuzzyText
      fontFamily='"Permanent Marker", cursive'
        baseIntensity={0.2}
        hoverIntensity={0.5}
        enableHover>
        not found
      </FuzzyText>
    </div>
  )}

export default NotFound
