import './DakiniTeachings.css';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const chapters = [
  { id: 'first', name: 'First of All', subtitle: 'The Teachings of Ascending with the Conduct' },
  { id: 'refuge', name: 'Taking Refuge', subtitle: 'The Basis for All Dharma Practice' },
  { id: 'foundations', name: 'The Ten Foundations', subtitle: 'Essential Points of Vajrayana' },
  { id: 'vajramaster', name: 'The Vajra Master', subtitle: 'On the Guru and Personal Deity' },
  { id: 'mindtraining', name: 'Mind Training', subtitle: 'Vajrayana Mind Training' },
  { id: 'essence', name: 'Refined Essence', subtitle: 'Final Oral Instructions' },
];

// Format text to highlight speaker names
const formatText = (text) => {
  // Highlight "Master Padma said:" and similar
  const speakerMatch = text.match(/^((?:Master Padma|The master|The great master|The nirmanakaya master|Lady Tsogyal)\s+(?:said|asked|replied):?\s*)/i);
  if (speakerMatch) {
    const attribution = speakerMatch[1];
    const rest = text.slice(speakerMatch[0].length);
    return (
      <>
        <span className="speaker-name">{attribution}</span>{rest}
      </>
    );
  }
  return text;
};

function DakiniTeachings() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [content, setContent] = useState('');
  const [currentChapter, setCurrentChapter] = useState('first');
  const contentRef = useRef(null);

  useEffect(() => {
    fetch('/texts/dakini_teachings.txt')
      .then(res => res.text())
      .then(text => setContent(text));
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

  // Parse content into paragraphs - join lines and split on "Master Padma said:" patterns
  const processedContent = content
    .replace(/\n(?!\n)/g, ' ')  // Join single newlines
    .replace(/\s+/g, ' ')       // Normalize whitespace
    .replace(/(Master Padma said:|The master said:|The great master said:|Lady Tsogyal asked:|The master replied:|The nirmanakaya master said:)/gi, '\n\n$1')
    .trim();

  const paragraphs = processedContent.split('\n\n').filter(p => p.trim());

  return (
    <div className="dakini-page-wrapper">
      <div className="page-content dakini-page">
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

        <nav className="chapter-nav expanded">
          {chapters.map((ch) => (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              className={currentChapter === ch.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setCurrentChapter(ch.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="ch-name">{ch.name}</span>
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
          <div className="dakini-text" ref={contentRef}>
            <h1 className="scroll-title">Dakini Teachings</h1>
            <p className="scroll-subtitle">Padmasambhava's Oral Instructions to Lady Tsogyal</p>
            <p className="scroll-attribution">Translated by Erik Pema Kunsang</p>

            <div className="teaching-content">
              {paragraphs.map((para, idx) => (
                <p key={idx} className="teaching-para">
                  {formatText(para.trim())}
                </p>
              ))}
            </div>

            <p className="dakini-ending">Thus were the Dakini Teachings concealed as treasure.</p>
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
                  placeholder="Search the teachings..."
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

export default DakiniTeachings;
