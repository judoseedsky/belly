import './BhagavadGita.css';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

function BhagavadGita() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [text, setText] = useState('');
  const contentRef = useRef(null);

  // Load text on mount
  useEffect(() => {
    fetch('/texts/bhagavad_gita.txt')
      .then(res => res.text())
      .then(content => setText(content));
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

  // Split text into paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim());

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

        <nav className="chapter-nav expanded">
          <button
            className="nav-search-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span style={{marginLeft: '0.5rem'}}>Search</span>
          </button>
        </nav>

        <div className="scroll-container">
          <div className="scroll-top"></div>
          <div className="gita-text" ref={contentRef}>
            <h1 className="scroll-title">The Bhagavad Gita</h1>
            <p className="scroll-subtitle">The Song Celestial</p>
            <p className="scroll-attribution">Translated by Sir Edwin Arnold</p>

            {paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}

            <p className="gita-ending">The Bhagavad Gita</p>
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
