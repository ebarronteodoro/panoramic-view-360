import React, { useEffect, useState, useRef } from 'react'
import { Viewer, ImagePanorama } from 'panolens'
import '../index.css'

const PanoramaViewer = () => {
  const [isPortrait, setIsPortrait] = useState(false)
  const imageContainerRef = useRef(null)
  let lastTouchEnd = 0

  const handleOrientationChange = () => {
    if (window.orientation === 0 || window.orientation === 180) {
      setIsPortrait(true)
    } else {
      setIsPortrait(false)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (imageContainerRef.current.requestFullscreen) {
        imageContainerRef.current.requestFullscreen()
      } else if (imageContainerRef.current.mozRequestFullScreen) { // Firefox
        imageContainerRef.current.mozRequestFullScreen()
      } else if (imageContainerRef.current.webkitRequestFullscreen) { // Chrome, Safari and Opera
        imageContainerRef.current.webkitRequestFullscreen()
      } else if (imageContainerRef.current.msRequestFullscreen) { // IE/Edge
        imageContainerRef.current.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen()
      }
    }
  }

  const handleTouchEnd = () => {
    const now = (new Date()).getTime()
    if (now - lastTouchEnd <= 300) {
      toggleFullscreen()
    }
    lastTouchEnd = now
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

    const viewer = new Viewer({
      container: imageContainerRef.current,
      autoRotate: false,
      controlBar: true,
      controlButtons: ['fullscreen'],
      cameraFov: 70
    })

    viewer.add(panoramaImage)

    const imageContainer = imageContainerRef.current
    imageContainer.addEventListener('dblclick', toggleFullscreen)
    imageContainer.addEventListener('touchend', handleTouchEnd)

    // Cleanup event listeners
    return () => {
      imageContainer.removeEventListener('dblclick', toggleFullscreen)
      imageContainer.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <div className='main-container'>
      <h1>Hi, Welcome</h1>
      <div className='image-container' ref={imageContainerRef} />
      {isPortrait && (
        <div className='rotate-message'>
          Por favor gire tu dispositivo
        </div>
      )}
    </div>
  )
}

export default PanoramaViewer
