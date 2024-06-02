import React, { useEffect, useState, useRef } from 'react'
import { Viewer, ImagePanorama } from 'panolens'
import MobileRotatedIcon from '../icons/MobileRotatedIcon'
import AsideBar from './AsideBar'
import '../index.css'

const PanoramaViewer = () => {
  const [isPortrait, setIsPortrait] = useState(false)
  const mainContainerRef = useRef(null)
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
      if (mainContainerRef.current.requestFullscreen) {
        mainContainerRef.current.requestFullscreen()
      } else if (mainContainerRef.current.mozRequestFullScreen) { // Firefox
        mainContainerRef.current.mozRequestFullScreen()
      } else if (mainContainerRef.current.webkitRequestFullscreen) { // Chrome, Safari and Opera
        mainContainerRef.current.webkitRequestFullscreen()
      } else if (mainContainerRef.current.msRequestFullscreen) { // IE/Edge
        mainContainerRef.current.msRequestFullscreen()
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
      container: mainContainerRef.current,
      autoRotate: true,
      autoRotateSpeed: 0.3,
      controlBar: true,
      controlButtons: ['fullscreen'],
      cameraFov: 55
    })

    viewer.add(panoramaImage)

    const mainContainer = mainContainerRef.current
    mainContainer.addEventListener('dblclick', toggleFullscreen)
    mainContainer.addEventListener('touchend', handleTouchEnd)

    // Cleanup event listeners
    return () => {
      mainContainer.removeEventListener('dblclick', toggleFullscreen)
      mainContainer.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <div className='main-container' ref={mainContainerRef}>
      <AsideBar>
        <h2>Test 360 😎</h2>
        <ul>
          <li>Esto</li>
          <li>es una</li>
          <li>prueba</li>
        </ul>
      </AsideBar>
      <div className='image-container' />
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
