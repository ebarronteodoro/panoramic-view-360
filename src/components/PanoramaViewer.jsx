import React, { useEffect, useState } from 'react'
import { Viewer, ImagePanorama } from 'panolens'
import '../index.css'

const PanoramaViewer = () => {
  const [isPortrait, setIsPortrait] = useState(false)

  const handleOrientationChange = () => {
    if (window.orientation === 0 || window.orientation === 180) {
      setIsPortrait(true)
    } else {
      setIsPortrait(false)
    }
  }

  useEffect(() => {
    // Check initial orientation
    handleOrientationChange()

    // Add event listener for orientation change
    window.addEventListener('orientationchange', handleOrientationChange)

    // Cleanup event listener
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  useEffect(() => {
    const panoramaImage = new ImagePanorama('images/image1.jpeg')
    const imageContainer = document.querySelector('.image-container')

    const viewer = new Viewer({
      container: imageContainer,
      autoRotate: false,
      controlBar: true,
      controlButtons: ['fullscreen'],
      cameraFov: 70
    })

    viewer.add(panoramaImage)
  }, [])

  return (
    <div className='main-container'>
      <div className='image-container' />
      {isPortrait && (
        <div className='rotate-message'>
          Por favor gire tu dispositivo
        </div>
      )}
    </div>
  )
}

export default PanoramaViewer
