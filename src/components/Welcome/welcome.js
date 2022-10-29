import React from "react";
import "./welcome.css";

const welcome = () => {
    return(
        <div className="welcome-bck">
            <div className="center">
                <h1>Tricia ولادة Belly 🍒🍓🍎</h1>
                <div className="links">
                    <h2><a href="/thread">Thread</a></h2>
                    <div id="gate"><h2><a href="/texts" id="txt">Sacred Texts</a></h2></div>
                    <h2><a href="/health">Health</a></h2>
                </div>
            </div>
        </div>
    )
}

export default welcome;