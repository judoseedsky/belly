import React from "react"
import dervish from "../img/dervish.gif"

const LoadingScreen = () => {
    return(
        <>
            <div className="center" style={{backgroundColor: "white"}}>
                <img src={dervish} alt="Whirling Dervish"></img>
                <p>Loading...</p>
            </div>
        </>
    )
}

export default LoadingScreen