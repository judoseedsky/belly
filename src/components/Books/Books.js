import React from "react"
import { Link } from 'react-router-dom';
import ell from "../../files/elella.pdf"
import './books.css';
import dakini from "../../files/dakini.pdf"
// import sky from "../../img/sky.png"

const Books = () => {
    return(
        <div className="texts-bck">
            <Link to="/">
                <svg
                    className="back-btn-icon"
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                >
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </Link>
            {/* <img alt="sky" src={sky} id="sky"/> */}
            <div className="box">
                <ul className="list">
                    <h1>Yoga</h1>
                    <li>
                        <Link to="/bhagavad-gita">Bhagavad Gita</Link>
                    </li>
                    <li>
                        <Link to="/yoga-sutras">Yoga Sutras</Link>
                    </li>
                    <h1>Gnostic</h1>
                    <li>
                        <Link to="/hymn-of-the-pearl">Hymn of the Pearl</Link>
                    </li>
                    <li>
                        <Link to="/gospel-of-philip">Gospel of Philip</Link>
                    </li>
                </ul>

                <ul className="list">
                    <h1>Buddhist</h1>
                    <li>
                        <a href={dakini}>Dakini Teachings</a>
                    </li>
                    <li>
                        <Link to="/ornament-of-stainless-light">Ornament of Stainless Light</Link>
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

export default Books