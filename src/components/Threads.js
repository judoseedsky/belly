import "../components/Books/books.css"
import { Link } from 'react-router-dom';

const Threads = () => {
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
            <div className="box">
                <ul className="list">
                    <h1>Thread</h1>
                    <li>
                        <Link to="/musings-on-beaty">Musings On Beauty יוֹפִי श्री 美麗 زیبایی</Link>
                    </li>
                    <li>
                        <Link to="/broodings-on-spritual-ego">Broodings On The "Spiritual Ego" אֶגוֹ अहंकार 自我 نفس</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Threads