import React from "react"
import ell from "../../files/elella.pdf"
import './books.css';
import dakini from "../../files/dakini.pdf"
// import sky from "../../img/sky.png"

const books = () => {
    return(
        <div className="texts-bck">
            {/* <img alt="sky" src={sky} id="sky"/> */}
            <div className="box">
                <ul className="list">
                    <h1>Yoga</h1>
                    <li>
                        <a href="https://www.holy-bhagavad-gita.org/index">Bhagavad Gita</a>
                    </li>
                    <li>
                        Yoga Sutras
                    </li>
                    <h1>Gnostic</h1>
                    <li>
                        Gospel of Phillip
                    </li>
                </ul>

                <ul className="list">
                    <h1>Buddhist</h1>
                    <li>
                        <a href={dakini}>Dakini Teachings</a>
                    </li>
                    {/* <li>
                        <a href={ell}>Tibetan Book of the Dead</a>
                    </li> */}
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