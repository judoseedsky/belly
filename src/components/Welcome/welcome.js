import React, { useState, useEffect } from "react"
import "./welcome.css"
import useSound from 'use-sound'
import song from '../../files/gave.mp3'
import soundIcon from '../../img/icons/sound.png'
import muteIcon from '../../img/icons/mute.png'

const Welcome = () => {

  let [vol, setVol] = useState(0.7)
  const [playSound, {duration}] = useSound(song, { volume: vol })
  const [playing, setPlaying] = useState(true)
  
  const toggleMusic = () => {
    vol === 0.7 ? setVol(0) : setVol(0.7)
    playing === true? setPlaying(false) : setPlaying(true)
    console.log(duration)
  }

  useEffect(() => {
    playSound()
  }, [playSound]);

    return(
        <div className="welcome-bck">
            <div className="center">
            <h1>Tricia ولادة Belly 🍒🍓🍎</h1>
                <div className="links">
                    <h2><a href="/thread" target="_blank">Thread</a></h2>
                    <div id="gate"><h2><a href="/texts" target="_blank" id="txt">Sacred Texts</a></h2></div>
                    <h2><a href="/health" target="_blank">Health</a></h2>
                </div>
            </div>
            <div onClick={() => toggleMusic()}>
        <img src={playing ? soundIcon : muteIcon} id="sound" alt="" height="25px" width="25px"/>
      </div>
        </div>
        
    )
}

export default Welcome;