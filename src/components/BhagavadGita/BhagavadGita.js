import './BhagavadGita.css';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

// Chapter data with Sanskrit names and English titles
const chapters = [
  { num: 'I', name: 'Arjuna\'s Grief', sanskrit: 'Arjun-Vishad' },
  { num: 'II', name: 'Doctrines', sanskrit: 'Sankhya-Yog' },
  { num: 'III', name: 'Virtue in Work', sanskrit: 'Karma-Yog' },
  { num: 'IV', name: 'Knowledge', sanskrit: 'Jnana-Yog' },
  { num: 'V', name: 'Renunciation', sanskrit: 'Karmasanyasa-Yog' },
  { num: 'VI', name: 'Self-Restraint', sanskrit: 'Atmasanyama-Yog' },
  { num: 'VII', name: 'Discernment', sanskrit: 'Vijnana-Yog' },
  { num: 'VIII', name: 'The Supreme', sanskrit: 'Aksharabrahma-Yog' },
  { num: 'IX', name: 'Kingly Mystery', sanskrit: 'Rajavidya-Yog' },
  { num: 'X', name: 'Perfections', sanskrit: 'Vibhuti-Yog' },
  { num: 'XI', name: 'The Vision', sanskrit: 'Viswarupa-Yog' },
  { num: 'XII', name: 'Faith', sanskrit: 'Bhakti-Yog' },
  { num: 'XIII', name: 'Matter & Spirit', sanskrit: 'Kshetra-Yog' },
  { num: 'XIV', name: 'The Qualities', sanskrit: 'Gunatraya-Yog' },
  { num: 'XV', name: 'The Supreme', sanskrit: 'Purushottama-Yog' },
  { num: 'XVI', name: 'Divine & Undivine', sanskrit: 'Daivasura-Yog' },
  { num: 'XVII', name: 'Threefold Faith', sanskrit: 'Sraddhatraya-Yog' },
  { num: 'XVIII', name: 'Deliverance', sanskrit: 'Moksha-Yog' }
];

function BhagavadGita() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [text, setText] = useState('');
  const [parsedChapters, setParsedChapters] = useState([]);
  const contentRef = useRef(null);

  // Load and parse text on mount
  useEffect(() => {
    fetch('/texts/bhagavad_gita.txt')
      .then(res => res.text())
      .then(content => {
        setText(content);
        // Parse chapters from text
        const chapterRegex = /CHAPTER\s+([IVXLC]+)\s*\n([\s\S]*?)(?=CHAPTER\s+[IVXLC]+|HERE ENDS, WITH CHAPTER)/gi;
        const parsed = [];
        let match;

        // Find all chapters
        const lines = content.split('\n');
        let currentChapter = null;
        let chapterContent = [];
        let inChapter = false;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          if (line.trim().match(/^CHAPTER\s+[IVXLC]+\s*$/)) {
            if (currentChapter !== null) {
              parsed.push({ num: currentChapter, content: chapterContent.join('\n') });
            }
            currentChapter = line.trim().replace('CHAPTER', '').trim();
            chapterContent = [];
            inChapter = true;
          } else if (line.match(/HERE ENDETH CHAPTER|HERE ENDS, WITH CHAPTER/)) {
            if (currentChapter !== null) {
              parsed.push({ num: currentChapter, content: chapterContent.join('\n') });
              currentChapter = null;
              chapterContent = [];
              inChapter = false;
            }
          } else if (inChapter) {
            chapterContent.push(line);
          }
        }

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

  // Format chapter content - handle speaker names and verses
  const formatContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements = [];
    let currentParagraph = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines at start
      if (line === '' && currentParagraph.length === 0) continue;

      // Check if this is a speaker line (like "Arjuna." or "Krishna:" or "Sanjaya.")
      const speakerMatch = line.match(/^([A-Za-z]+)[.:]\s*$/);
      if (speakerMatch) {
        // Flush current paragraph
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${i}`} className="verse">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        elements.push(
          <p key={`speaker-${i}`} className="speaker">{speakerMatch[1]}</p>
        );
        continue;
      }

      // Empty line means new paragraph
      if (line === '') {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${i}`} className="verse">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
      } else {
        currentParagraph.push(line);
      }
    }

    // Don't forget last paragraph
    if (currentParagraph.length > 0) {
      elements.push(
        <p key="p-last" className="verse">
          {currentParagraph.join(' ')}
        </p>
      );
    }

    return elements;
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
          {chapters.map((ch, idx) => (
            <a key={idx} href={`#ch${idx + 1}`}>
              <span className="ch-num">{ch.num}</span>
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
          <div className="gita-text" ref={contentRef}>
            <h1 className="scroll-title">The Bhagavad Gita</h1>
            <p className="scroll-subtitle">The Song Celestial</p>
            <p className="scroll-attribution">Translated by Sir Edwin Arnold</p>

            {parsedChapters.map((chapter, idx) => (
              <section key={idx} className="chapter-section">
                <h2 id={`ch${idx + 1}`}>
                  Chapter {chapter.num} · {chapters[idx]?.name || ''}
                </h2>
                <p className="chapter-subtitle">{chapters[idx]?.sanskrit || ''}</p>
                {formatContent(chapter.content)}
              </section>
            ))}

            <p className="gita-ending">Here Ends The Bhagavad Gita</p>
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
