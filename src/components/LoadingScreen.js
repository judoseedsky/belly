import React from "react"
import dervish from "../img/dervish.gif"

const LoadingScreen = () => {
    return(
        <>
            <div className="center" style={{backgroundColor: "white"}}>
                <img src={dervish} alt="Whirling Dervish" height="100px" width="100px"></img>
                <p>Loading...</p>
            </div>
        </>
    )
}

export default LoadingScreen