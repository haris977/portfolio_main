import React from 'react'
import { HoverBorderGradient } from './ui/BorderGradient'

const DownloadButtonUi = () => {
  return (
    <div>
      <a
        href="https://drive.google.com/uc?export=download&id=1QWQ7ldKK9Uu9czciF6VgMfZDuF-AmNzk"        
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        <HoverBorderGradient>
          <div className='hover:cursor-pointer'>
            DOWNLOAD CV
          </div>
        </HoverBorderGradient>
      </a>
    </div>
  )
}

export default DownloadButtonUi
