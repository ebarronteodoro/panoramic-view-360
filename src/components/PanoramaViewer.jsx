import React, { useEffect, useState, useRef } from 'react'
import { Viewer, ImagePanorama } from 'panolens'
import MobileRotatedIcon from '../icons/MobileRotatedIcon'
import AsideBar from './AsideBar'
import '../index.css'

const PanoramaViewer = () => {
  const [isPortrait, setIsPortrait] = useState(false)
  const imageContainerRef = useRef(null)
  const viewerRef = useRef(null)
  let lastTouchEnd = 0

  const handleOrientationChange = () => {
    if (window.orientation === 0 || window.orientation === 180) {
      setIsPortrait(true)
    } else {
      setIsPortrait(false)
    }
  }

  const toggleFullscreen = () => {
    const mainContainer = document.documentElement
    if (!document.fullscreenElement) {
      if (mainContainer.requestFullscreen) {
        mainContainer.requestFullscreen()
      } else if (mainContainer.mozRequestFullScreen) { // Firefox
        mainContainer.mozRequestFullScreen()
      } else if (mainContainer.webkitRequestFullscreen) { // Chrome, Safari and Opera
        mainContainer.webkitRequestFullscreen()
      } else if (mainContainer.msRequestFullscreen) { // IE/Edge
        mainContainer.msRequestFullscreen()
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

    viewerRef.current = new Viewer({
      container: imageContainerRef.current,
      autoRotate: true,
      autoRotateSpeed: 0.3,
      controlBar: true,
      controlButtons: ['fullscreen'],
      cameraFov: 55
    })

    viewerRef.current.add(panoramaImage)

    const imageContainer = imageContainerRef.current
    imageContainer.addEventListener('touchend', handleTouchEnd)

    // Cleanup event listeners
    return () => {
      imageContainer.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <div className='main-container'>
      <AsideBar>
        <h2>Test 360 😎</h2>
        <ul>
          <li>Esto</li>
          <li>es una</li>
          <li>prueba</li>
        </ul>
      </AsideBar>
      <div className='image-container' ref={imageContainerRef} />
      {isPortrait && (
        <div className='rotate-message'>
          <MobileRotatedIcon width='90' height='90' />
          Por favor, gire el dispositivo
        </div>
      )}
    </div>
  )
}

export default PanoramaViewer
