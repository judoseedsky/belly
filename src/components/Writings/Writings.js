import './writings.css';
import { Link } from 'react-router-dom';

const Writings = ({title, tweets}) => {
    return(
        <div className="writings-page">
            <Link to="/" className="back-link">
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
            <div className="writings-content">
                <h1 className="writings-title">{title}</h1>
                <ul className='writings-list'>
                    {Object.keys(tweets).map(key => (
                        <li key={key}>
                            {tweets[key].split('\n').map((line, i) => (
                                <span key={i}>{line}{i < tweets[key].split('\n').length - 1 && <br/>}</span>
                            ))}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Writings
