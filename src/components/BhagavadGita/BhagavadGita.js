import './BhagavadGita.css';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

// Chapter data with Sanskrit names and English titles
// Format verse text to highlight speaker names
const formatVerseText = (text) => {
  const speakerMatch = text.match(/^(Arjun|Shree Krishna|Sanjay|Dhritarashtra|The Supreme Lord)(\s+said:?\s*)/i);
  if (speakerMatch) {
    const speaker = speakerMatch[1];
    const said = speakerMatch[2];
    const rest = text.slice(speakerMatch[0].length);
    return (
      <>
        <span className="speaker-name">{speaker}</span>{said}{rest}
      </>
    );
  }
  return text;
};

const chapters = [
  { num: 1, name: 'Arjun Vishad Yog', subtitle: 'Lamenting the Consequences of War' },
  { num: 2, name: 'Sankhya Yog', subtitle: 'The Yog of Analytical Knowledge' },
  { num: 3, name: 'Karma Yog', subtitle: 'The Yog of Action' },
  { num: 4, name: 'Jnana Karma Sanyasa Yog', subtitle: 'The Yog of Knowledge and Renunciation' },
  { num: 5, name: 'Karma Sanyasa Yog', subtitle: 'The Yog of Renunciation' },
  { num: 6, name: 'Dhyana Yog', subtitle: 'The Yog of Meditation' },
  { num: 7, name: 'Vijnana Yog', subtitle: 'Yog through Knowledge of the Ultimate Truth' },
  { num: 8, name: 'Akshar Brahma Yog', subtitle: 'The Yog of the Eternal God' },
  { num: 9, name: 'Raja Vidya Yog', subtitle: 'Yog through the King of Sciences' },
  { num: 10, name: 'Vibhuti Yog', subtitle: 'Yog through Appreciating the Infinite Opulences of God' },
  { num: 11, name: 'Vishwaroop Darshan Yog', subtitle: 'Yog through Beholding the Cosmic Form of God' },
  { num: 12, name: 'Bhakti Yog', subtitle: 'The Yog of Devotion' },
  { num: 13, name: 'Kshetra Kshetrajna Vibhag Yog', subtitle: 'Yog through Distinguishing the Field and the Knower' },
  { num: 14, name: 'Gunatraya Vibhag Yog', subtitle: 'Yog through Understanding the Three Modes of Nature' },
  { num: 15, name: 'Purushottam Yog', subtitle: 'The Yog of the Supreme Divine Personality' },
  { num: 16, name: 'Daivasura Sampad Vibhag Yog', subtitle: 'Yog through Discerning the Divine and Demoniac Natures' },
  { num: 17, name: 'Shraddhatraya Vibhag Yog', subtitle: 'Yog through Discerning the Three Divisions of Faith' },
  { num: 18, name: 'Moksha Sanyasa Yog', subtitle: 'Yog through the Perfection of Renunciation and Surrender' }
];

function BhagavadGita() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [parsedChapters, setParsedChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(1);
  const contentRef = useRef(null);

  // Load and parse text on mount
  useEffect(() => {
    fetch('/texts/bhagavad_gita.txt')
      .then(res => res.text())
      .then(content => {
        const lines = content.split('\n').filter(line => line.trim());
        const chaptersMap = {};

        lines.forEach(line => {
          const match = line.match(/^BG (\d+)\.(\d+): (.+)$/);
          if (match) {
            const chapterNum = parseInt(match[1]);
            const verseNum = match[2];
            const translation = match[3];

            if (!chaptersMap[chapterNum]) {
              chaptersMap[chapterNum] = [];
            }
            chaptersMap[chapterNum].push({
              verse: verseNum,
              text: translation
            });
          }
        });

        // Convert to array
        const parsed = Object.keys(chaptersMap)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(chNum => ({
            num: parseInt(chNum),
            verses: chaptersMap[chNum]
          }));

        setParsedChapters(parsed);
      });
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length < 2 || !contentRef.current) {
      setSearchResults([]);
      return;
    }
    const textContent = contentRef.current.innerText;
    const regex = new RegExp(query, 'gi');
    const matches = [];
    let match;
    while ((match = regex.exec(textContent)) !== null) {
      const start = Math.max(0, match.index - 40);
      const end = Math.min(textContent.length, match.index + query.length + 40);
      matches.push({
        text: textContent.slice(start, end),
        index: match.index
      });
      if (matches.length >= 20) break;
    }
    setSearchResults(matches);
  };

  const navigateToResult = (result) => {
    setSearchOpen(false);
    if (window.find) {
      window.find(searchQuery, false, false, true);
    }
  };

  return (
    <div className="gita-page-wrapper">
      <div className="page-content gita-page">
        <Link to="/texts">
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

        <nav className="chapter-nav expanded gita-nav">
          {chapters.map((ch) => (
            <a
              key={ch.num}
              href={`#ch${ch.num}`}
              className={currentChapter === ch.num ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setCurrentChapter(ch.num);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="ch-num">{ch.num}</span>
              <span className="ch-name">{ch.name.split(' ')[0]}</span>
            </a>
          ))}
          <button
            className="nav-search-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
        </nav>

        <div className="scroll-container">
          <div className="scroll-top"></div>
          <div className="gita-text" ref={contentRef}>
            <h1 className="scroll-title">Bhagavad Gita</h1>
            <p className="scroll-subtitle">The Song of God</p>
            <p className="scroll-attribution">Translation by Swami Mukundananda</p>

            {parsedChapters.filter(ch => ch.num === currentChapter).map((chapter) => {
              const chapterInfo = chapters[chapter.num - 1];
              return (
                <section key={chapter.num} className="chapter-section">
                  <h2 id={`ch${chapter.num}`}>
                    Chapter {chapter.num}: {chapterInfo?.name}
                  </h2>
                  <p className="chapter-subtitle">{chapterInfo?.subtitle}</p>

                  {chapter.verses.map((verse, idx) => (
                    <div key={idx} className="verse-block">
                      <div className="verse-number">Bhagavad Gita {chapter.num}.{verse.verse}</div>
                      <p className="verse-text">{formatVerseText(verse.text)}</p>
                    </div>
                  ))}
                </section>
              );
            })}

            <p className="gita-ending">Hari Om Tat Sat</p>
          </div>
          <div className="scroll-bottom"></div>
        </div>

        {searchOpen && (
          <div className="search-overlay" onClick={() => setSearchOpen(false)}>
            <div className="search-panel" onClick={e => e.stopPropagation()}>
              <div className="search-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(60,40,20,0.5)" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search the Gita..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                />
                <button className="search-close" onClick={() => setSearchOpen(false)}>&times;</button>
              </div>
              <div className="search-results-panel">
                {searchQuery.length < 2 ? (
                  <p className="search-hint">Enter at least 2 characters to search</p>
                ) : searchResults.length === 0 ? (
                  <p className="search-hint">No results found</p>
                ) : (
                  <>
                    <p className="search-count">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found</p>
                    {searchResults.map((result, idx) => (
                      <div
                        key={idx}
                        className="search-result-item"
                        onClick={() => navigateToResult(result)}
                      >
                        <span className="search-result-text">...{result.text}...</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BhagavadGita;
