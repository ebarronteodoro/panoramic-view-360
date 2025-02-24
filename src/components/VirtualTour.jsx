import React, { useEffect, useRef, useState } from 'react'
import AsideBar from './AsideBar'
import MobileRotatedIcon from '../icons/MobileRotatedIcon'
import '../index.css'

const VirtualTour = () => {
  const pannellumRef = useRef(null)
  const viewerRef = useRef(null)
  const [isPortrait, setIsPortrait] = useState(false)
  let lastTouchEnd = 0

  const handleOrientationChange = () => {
    if (window.orientation === 0 || window.orientation === 180) {
      setIsPortrait(true)
    } else {
      setIsPortrait(false)
    }
  }

  const handleTouchEnd = () => {
    const now = new Date().getTime()
    if (now - lastTouchEnd <= 300) {
      toggleFullscreen()
    }
    lastTouchEnd = now
  }

  const toggleFullscreen = () => {
    const mainContainer = document.documentElement
    if (!document.fullscreenElement) {
      if (mainContainer.requestFullscreen) {
        mainContainer.requestFullscreen()
      } else if (mainContainer.mozRequestFullScreen) {
        // Firefox
        mainContainer.mozRequestFullScreen()
      } else if (mainContainer.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        mainContainer.webkitRequestFullscreen()
      } else if (mainContainer.msRequestFullscreen) {
        // IE/Edge
        mainContainer.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari and Opera
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen()
      }
    }
  }

  useEffect(() => {
    if (!window.pannellum || !pannellumRef.current) return

    if (!viewerRef.current) {
      viewerRef.current = window.pannellum.viewer(pannellumRef.current, {
        default: {
          firstScene: 'sala',
          autoLoad: true,
          showControls: false, // 🔹 Oculta todos los controles de Pannellum
          keyboardZoom: false, // 🔹 Desactiva el zoom con el teclado
          disableKeyboardCtrl: true, // 🔹 Desactiva todos los controles de teclado
          sceneFadeDuration: 1000
        },
        scenes: {
          sala: {
            type: 'equirectangular',
            panorama: '/tour/sala.png',
            hotSpots: [
              {
                pitch: 0,
                yaw: -25,
                cssClass: 'custom-hotspot',
                text: 'Ir a Cocina',
                sceneId: 'cocina'
              },
              {
                pitch: -8,
                yaw: -53,
                cssClass: 'custom-hotspot',
                text: 'Ir a Comedor',
                sceneId: 'comedor'
              }
            ]
          },
          sala2: {
            type: 'equirectangular',
            panorama: '/tour/sala2.png',
            hotSpots: [
              {
                pitch: -10,
                yaw: 45,
                cssClass: 'custom-hotspot',
                text: 'Ir a Cocina',
                sceneId: 'cocina'
              },
              {
                pitch: -5,
                yaw: -30,
                cssClass: 'custom-hotspot',
                text: 'Ir a Comedor',
                sceneId: 'comedor'
              }
            ]
          },
          cocina: {
            type: 'equirectangular',
            panorama: '/tour/cocina.png',
            hotSpots: [
              {
                pitch: -10,
                yaw: 45,
                cssClass: 'custom-hotspot',
                text: 'Ir a Sala',
                sceneId: 'sala'
              },
              {
                pitch: -5,
                yaw: -30,
                cssClass: 'custom-hotspot',
                text: 'Ir a Baño',
                sceneId: 'baño'
              }
            ]
          },
          comedor: {
            type: 'equirectangular',
            panorama: '/tour/comedor.png',
            hotSpots: [
              {
                pitch: -10,
                yaw: 45,
                cssClass: 'custom-hotspot',
                text: 'Ir a Sala',
                sceneId: 'sala'
              },
              {
                pitch: -15,
                yaw: -56,
                cssClass: 'custom-hotspot',
                text: 'Ir a Habitacion',
                sceneId: 'habitacion'
              }
            ]
          },
          habitacion: {
            type: 'equirectangular',
            panorama: '/tour/habitacion.png',
            hotSpots: [
              {
                pitch: -30,
                yaw: -115,
                cssClass: 'custom-hotspot',
                text: 'Ir a Comedor',
                sceneId: 'comedor'
              },
              {
                pitch: -30,
                yaw: -105,
                cssClass: 'custom-hotspot',
                text: 'Ir a Baño',
                sceneId: 'baño'
              }
            ]
          },
          baño: {
            type: 'equirectangular',
            panorama: '/tour/baño.png',
            hotSpots: [
              {
                pitch: -10,
                yaw: 45,
                cssClass: 'custom-hotspot',
                text: 'Ir a Habitacion',
                sceneId: 'habitacion'
              },
              {
                pitch: -5,
                yaw: -30,
                cssClass: 'custom-hotspot',
                text: 'Ir a Cocina',
                sceneId: 'cocina'
              }
            ]
          }
        }
      })
    }

    const handleClick = event => {
      const pitch = viewerRef.current.getPitch()
      const yaw = viewerRef.current.getYaw()
      console.log(`Pitch: ${pitch}, Yaw: ${yaw}`)
    }

    viewerRef.current.on('mousedown', handleClick)

    handleOrientationChange()

    // Add event listener for orientation change
    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('touchend', handleTouchEnd)

    // Cleanup event listener
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('touchend', handleTouchEnd)
      viewerRef.current.off('mousedown', handleClick)
    }
  }, [])

  return (
    <div className='main-container'>
      <AsideBar>
        <img src='/images/logo-soil.png' alt='Logo de Soil' />
        <h1>Tour Panorámico</h1>
      </AsideBar>
      <div className='image-container' ref={pannellumRef} />

      {isPortrait && (
        <div className='rotate-message'>
          <MobileRotatedIcon width='90' height='90' />
          Por favor, gire el dispositivo
        </div>
      )}
    </div>
  )
}

export default VirtualTour
