import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./welcome.css"

const Welcome = () => {
    const navigate = useNavigate()
    const [transitioning, setTransitioning] = useState(false)
    const [clickPos, setClickPos] = useState({ x: 0, y: 0 })

    const handleNavigation = (e, path) => {
        const rect = e.target.getBoundingClientRect()
        setClickPos({
            x: rect.left + rect.width / 2,
            y: rect.top - 90
        })
        setTransitioning(true)
        setTimeout(() => {
            navigate(path)
        }, 1300)
    }

    return(
        <div className="welcome-bck">
            {transitioning && (
                <div className="page-transition">
                    <div
                        className="dervish-expand"
                        style={{ left: clickPos.x, top: clickPos.y }}
                    ></div>
                </div>
            )}
            <div className="center">
                <h1>Tricia ولادة Belly</h1>
                <div className={`links ${transitioning ? 'transitioning' : ''}`}>
                    <h2><span onClick={(e) => handleNavigation(e, '/thread')}>Thread</span></h2>
                    <div id="gate">
                        <h2><span onClick={(e) => handleNavigation(e, '/texts')} id="txt">Sacred Texts</span></h2>
                    </div>
                    <h2><span className="disabled">Health</span></h2>
                </div>
            </div>
        </div>
    )
}

export default Welcome;