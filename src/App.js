import './App.css'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation
} from "react-router-dom"
import React, { useState, useRef, lazy, Suspense, useEffect } from "react"
import threadText from "./utils/threadTexts"
import belly from "./img/belly-nobck.png"
import song from "./files/gave.mp3"

// Lazy load route components for faster initial load
const Welcome = lazy(() => import("./components/Welcome/welcome"))
const Books = lazy(() => import("./components/Books/Books"))
const Threads = lazy(() => import("./components/Threads"))
const Health = lazy(() => import("./components/Health/health"))
const Writings = lazy(() => import('./components/Writings/Writings'))
const YogaSutras = lazy(() => import('./components/YogaSutras/YogaSutras'))
const HymnOfThePearl = lazy(() => import('./components/HymnOfThePearl/HymnOfThePearl'))
const OrnamentOfStainlessLight = lazy(() => import('./components/OrnamentOfStainlessLight/OrnamentOfStainlessLight'))
const GospelOfPhilip = lazy(() => import('./components/GospelOfPhilip/GospelOfPhilip'))
const BhagavadGita = lazy(() => import('./components/BhagavadGita/BhagavadGita'))
const DakiniTeachings = lazy(() => import('./components/DakiniTeachings/DakiniTeachings'))
const ElElla = lazy(() => import('./components/ElElla/ElElla'))

function AppContent({ playing, toggleMusic, stopMusic }) {
  const location = useLocation()
  const hideBellyPages = ['/texts', '/yoga-sutras', '/hymn-of-the-pearl', '/ornament-of-stainless-light', '/gospel-of-philip', '/bhagavad-gita', '/dakini-teachings', '/el-ella']
  const hideMusicPages = ['/yoga-sutras', '/hymn-of-the-pearl', '/ornament-of-stainless-light', '/gospel-of-philip', '/bhagavad-gita', '/dakini-teachings', '/el-ella']
  const hideBelly = hideBellyPages.some(p => location.pathname.startsWith(p))
  const hideMusic = hideMusicPages.some(p => location.pathname.startsWith(p))

  // Stop music when entering a book page
  useEffect(() => {
    if (hideMusic && playing) {
      stopMusic()
    }
  }, [hideMusic, playing, stopMusic])

  return (
    <>
      <Suspense fallback={<div style={{background: 'black', minHeight: '100vh'}}></div>}>
        <Routes>
          <Route path="/" element={<Welcome/> }/>
          <Route path="/texts" element={<Books/> }/>
          <Route path="/thread" element={<Threads/> }/>
          <Route path="/health" element={<Health/> }/>
          <Route path="/musings-on-beaty"
          element={<Writings title={threadText[0].title}
          tweets={threadText[0].tweets} image={threadText[0].image}
          /> }/>
          <Route path="/broodings-on-spritual-ego"
          element={<Writings title={threadText[1].title}
          tweets={threadText[1].tweets} image={threadText[1].image}
          /> }/>
          <Route path="/yoga-sutras" element={<YogaSutras />} />
          <Route path="/hymn-of-the-pearl" element={<HymnOfThePearl />} />
          <Route path="/ornament-of-stainless-light" element={<OrnamentOfStainlessLight />} />
          <Route path="/gospel-of-philip" element={<GospelOfPhilip />} />
          <Route path="/bhagavad-gita" element={<BhagavadGita />} />
          <Route path="/dakini-teachings" element={<DakiniTeachings />} />
          <Route path="/dakini-teachings/:chapter" element={<DakiniTeachings />} />
          <Route path="/el-ella" element={<ElElla />} />
        </Routes>
      </Suspense>
      {!hideBelly && <img src={belly} id="belly" alt=""/>}
      {!hideMusic && (
        <svg
          onClick={toggleMusic}
          className="sound-btn-icon"
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="black"
        >
          {playing ? (
            <>
              <rect x="5" y="4" width="5" height="16"/>
              <rect x="14" y="4" width="5" height="16"/>
            </>
          ) : (
            <polygon points="5,3 19,12 5,21"/>
          )}
        </svg>
      )}
    </>
  )
}

function App() {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  const toggleMusic = () => {
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setPlaying(false)
    }
  }

  return (
    <div className="App">
      <audio ref={audioRef} src={song} preload="none" onEnded={() => setPlaying(false)} />
      <Router>
        <AppContent playing={playing} toggleMusic={toggleMusic} stopMusic={stopMusic} />
      </Router>
    </div>
  );
}

export default App;
