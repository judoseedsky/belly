import React from "react"
import ell from "../../files/elella.pdf"
import './books.css';
// import sky from "../../img/sky.png"

const books = () => {
    return(
        <div className="texts-bck">
            {/* <img alt="sky" src={sky} id="sky"/> */}
            <div className="box">
                <ul className="list">
                    <h1>Yoga</h1>
                    <li>
                        <a href={ell}>Bhagavad Gita</a>
                    </li>
                    <li>
                        <a href={ell}>Yoga Sutras</a>
                    </li>
                    <h1>Gnostic</h1>
                    <li>
                        <a href={ell}>Gospel of Phillip</a>
                    </li>
                </ul>

                <ul className="list">
                    <h1>Buddhist</h1>
                    <li>
                        <a href={ell}>Dakini Teachings</a>
                    </li>
                    <h1>Misc</h1>
                    <li>
                        <a href={ell}>El Ella Book of Magic Love</a>
                    </li>
                </ul>

            </div>
           
        </div>
    )
}

export default books