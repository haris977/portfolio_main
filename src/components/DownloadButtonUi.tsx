import React from 'react'
import { HoverBorderGradient } from './ui/BorderGradient'
const DownloadButtonUi = () => {
  return (
    <div>
      <HoverBorderGradient>
              <div  className='hover:cursor-pointer'>
                DOWNLOAD CV
              </div>
            </HoverBorderGradient>
    </div>
  )
}

export default DownloadButtonUi
