import './writtings.css';

const Writtings = ({title, tweets, image}) => {

    return(
        <>
            <div className="thread" style={{backgroundImage: `url(${image})`}}><h1>{title}</h1></div>
            <ul className='tweets'>
                {Object.keys(tweets).map(key => <li>{tweets[key]}</li>)}
            </ul>
            <h1 id="end">End</h1>
        </>
    )
}

export default Writtings