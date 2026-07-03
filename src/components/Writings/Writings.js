import './writings.css';
import { Link } from 'react-router-dom';

const Writings = ({title, tweets, image}) => {
    return(
        <>
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
            <div className="thread" style={{backgroundImage: `url(${image})`}}><h1>{title}</h1></div>
            <ul className='tweets'>
                {Object.keys(tweets).map(key => (
                    <li key={key}>
                        {tweets[key].split('\n').map((line, i) => (
                            <span key={i}>{line}{i < tweets[key].split('\n').length - 1 && <br/>}</span>
                        ))}
                    </li>
                ))}
            </ul>
            <h1 id="end">End</h1>
        </>
    )
}

export default Writings