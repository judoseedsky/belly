import './DakiniTeachings.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

// Tooltip component for hover/tap display
function Tooltip({ children, content, type }) {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [show]);

  return (
    <span
      ref={wrapperRef}
      className={`tooltip-wrapper tooltip-${type}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={(e) => {
        e.stopPropagation();
        setShow(!show);
      }}
    >
      {children}
      {show && content && (
        <span className="tooltip-content">{content}</span>
      )}
    </span>
  );
}

const chapters = [
  { id: 'first', num: 1, name: 'The Teachings of Ascending with the Conduct', shortName: 'Conduct' },
  { id: 'refuge', num: 2, name: 'Taking Refuge', shortName: 'Refuge' },
  { id: 'foundations', num: 3, name: 'The Ten Foundations of Secret Mantra', shortName: 'Foundations' },
  { id: 'vajramaster', num: 4, name: 'The Vajra Master and the Yidam Deity', shortName: 'Vajra' },
  { id: 'mindtraining', num: 5, name: 'Vajrayana Mind Training', shortName: 'Mind' },
  { id: 'essence', num: 6, name: 'The Refined Essence of Oral Instructions', shortName: 'Essence' },
  { id: 'glossary', num: 7, name: 'Glossary', shortName: 'Glossary', isGlossary: true },
];

// Parse glossary content into entries
const parseGlossary = (content) => {
  const entries = [];

  // Clean content: join lines, remove page headers, fix common OCR artifacts
  const cleanContent = content
    .replace(/\d+\s*Glossary\s*['*]?\s*/g, '')
    .replace(/\n(?!\n)/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/a\.ctions/g, 'actions')
    .replace(/\. ,/g, ',')
    .trim();

  // Pattern: ALL-CAPS words (may include Of, THE, AND, etc.) followed by (tibetan text)
  // This matches: "TERM (tibetan)" or "BILLIONFOLD UNIVERSE (tibetan)"
  const entryPattern = /([A-Z][A-Z\-']*(?:\s+(?:OF|THE|AND|IN|TO|WITH|FOR|OR|A|AN|[A-Z][A-Z\-']*))*)\s*(\([^)]+\))\s*/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = entryPattern.exec(cleanContent)) !== null) {
    if (lastIndex > 0) {
      // Get the definition from previous entry
      const prevDef = cleanContent.slice(lastIndex, match.index).trim();
      if (parts.length > 0 && prevDef) {
        parts[parts.length - 1].definition = prevDef;
      }
    }
    parts.push({
      term: match[1].trim(),
      tibetan: match[2],
      definition: ''
    });
    lastIndex = entryPattern.lastIndex;
  }

  // Get the last definition
  if (parts.length > 0 && lastIndex < cleanContent.length) {
    parts[parts.length - 1].definition = cleanContent.slice(lastIndex).trim();
  }

  // Format entries
  for (const part of parts) {
    if (part.term.length > 2 && part.definition.length > 3) {
      entries.push({
        term: `${part.term} ${part.tibetan}`,
        definition: part.definition
      });
    }
  }

  return entries;
};

function DakiniTeachings() {
  const { chapter } = useParams();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [parsedChapters, setParsedChapters] = useState({});
  const [expandedGlossary, setExpandedGlossary] = useState({});
  const [glossaryLookup, setGlossaryLookup] = useState({});
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const contentRef = useRef(null);

  // Highlight search terms in text
  const highlightSearch = (text) => {
    if (!activeSearchTerm || activeSearchTerm.length < 2) return text;
    const regex = new RegExp(`(${activeSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === activeSearchTerm.toLowerCase()
        ? <mark key={i} className="search-highlight">{part}</mark>
        : part
    );
  };

  // Default to chapter 1 if no chapter specified
  const currentChapter = chapter ? parseInt(chapter) : 1;

  // Redirect to chapter 1 if no chapter in URL
  useEffect(() => {
    if (!chapter) {
      navigate('/dakini-teachings/1', { replace: true });
    }
  }, [chapter, navigate]);

  useEffect(() => {
    fetch('/texts/dakini_teachings.txt')
      .then(res => res.text())
      .then(text => {
        // Split content by chapter markers
        const chapterMap = {};
        const parts = text.split(/===CHAPTER:(\w+)===/);

        // parts will be: ['', 'first', 'content...', 'refuge', 'content...', ...]
        for (let i = 1; i < parts.length; i += 2) {
          const chapterId = parts[i];
          const chapterContent = parts[i + 1] || '';
          chapterMap[chapterId] = chapterContent.trim();
        }

        setParsedChapters(chapterMap);
      });
  }, []);

  // Build glossary lookup when chapters are loaded
  useEffect(() => {
    if (parsedChapters.glossary) {
      const entries = parseGlossary(parsedChapters.glossary);
      const lookup = {};
      entries.forEach(entry => {
        // Extract just the term name (before the parentheses with Tibetan)
        const termMatch = entry.term.match(/^([A-Z][A-Z\-'\s]*)/);
        if (termMatch) {
          const termKey = termMatch[1].trim().toLowerCase();
          lookup[termKey] = entry.definition;
        }
      });
      setGlossaryLookup(lookup);
    }
  }, [parsedChapters]);

  // Reset expanded glossary when changing chapters
  useEffect(() => {
    setExpandedGlossary({});
  }, [currentChapter]);

  // Wrap glossary terms in tooltips
  const wrapGlossaryTerms = (text) => {
    if (!text || Object.keys(glossaryLookup).length === 0) {
      return highlightSearch(text);
    }

    // Sort terms by length (longest first)
    const terms = Object.keys(glossaryLookup).sort((a, b) => b.length - a.length);
    const escapedTerms = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

    const parts = text.split(pattern);

    return parts.map((part, i) => {
      const termLower = part.toLowerCase();
      const definition = glossaryLookup[termLower];
      if (definition) {
        return (
          <Tooltip key={i} content={definition} type="glossary">
            <span className="glossary-term-auto">{highlightSearch(part)}</span>
          </Tooltip>
        );
      }
      return highlightSearch(part);
    });
  };

  // Format text with speaker names and glossary terms
  const formatTextWithGlossary = (text) => {
    const speakerMatch = text.match(/^((?:Master Padma|The master|The great master|The nirmanakaya master|Lady Tsogyal)\s+(?:said|asked|replied):?\s*)/i);
    if (speakerMatch) {
      const attribution = speakerMatch[1];
      const rest = text.slice(speakerMatch[0].length);
      return (
        <>
          <span className="speaker-name">{highlightSearch(attribution)}</span>{wrapGlossaryTerms(rest)}
        </>
      );
    }
    return wrapGlossaryTerms(text);
  };

  const toggleGlossary = (idx) => {
    setExpandedGlossary(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const matches = [];
    // Search across all chapters
    chapters.forEach((ch) => {
      const chapterContent = parsedChapters[ch.id] || '';
      const regex = new RegExp(query, 'gi');
      let match;
      while ((match = regex.exec(chapterContent)) !== null) {
        const start = Math.max(0, match.index - 40);
        const end = Math.min(chapterContent.length, match.index + query.length + 40);
        matches.push({
          text: chapterContent.slice(start, end),
          chapterNum: ch.num,
          chapterName: ch.name,
          matchText: match[0]
        });
        if (matches.length >= 30) break;
      }
      if (matches.length >= 30) return;
    });
    setSearchResults(matches);
  };

  const navigateToResult = (result) => {
    // Navigate to the correct chapter
    if (result.chapterNum !== currentChapter) {
      navigate(`/dakini-teachings/${result.chapterNum}`);
    }
    // Set the search term for highlighting
    setActiveSearchTerm(result.matchText);
    setSearchOpen(false);

    // Scroll to the highlighted match after render
    setTimeout(() => {
      const highlights = document.querySelectorAll('mark.search-highlight');
      if (highlights.length > 0) {
        highlights[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  };

  // Get current chapter info and content
  const currentChapterInfo = chapters[currentChapter - 1];
  const currentContent = parsedChapters[currentChapterInfo?.id] || '';
  const isGlossary = currentChapterInfo?.isGlossary;

  // Process content into paragraphs or glossary entries
  let paragraphs = [];
  let glossaryEntries = [];

  if (isGlossary) {
    glossaryEntries = parseGlossary(currentContent);
  } else {
    const processedContent = currentContent
      .replace(/\n(?!\n)/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/(Master Padma said:|The master said:|The great master said:|Lady Tsogyal asked:|The master replied:|The nirmanakaya master said:)/gi, '\n\n$1')
      .trim();
    paragraphs = processedContent.split('\n\n').filter(p => p.trim());
  }

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
            <Link
              key={ch.id}
              to={`/dakini-teachings/${ch.num}`}
              className={currentChapter === ch.num ? 'active' : ''}
            >
              <span className="ch-num">{ch.num}</span>
              <span className="ch-name">{ch.shortName}</span>
            </Link>
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

            <section className="chapter-section">
              {isGlossary ? (
                <h2>Glossary</h2>
              ) : (
                <h2>Chapter {currentChapter}: {currentChapterInfo?.name}</h2>
              )}

              <div className="teaching-content">
                {isGlossary ? (
                  <dl className="glossary-list">
                    {glossaryEntries.map((entry, idx) => (
                      <div key={idx} className={`glossary-entry ${expandedGlossary[idx] ? 'expanded' : ''}`}>
                        <dt onClick={() => toggleGlossary(idx)}>
                          {entry.term}
                          <span className="glossary-toggle">{expandedGlossary[idx] ? '−' : '+'}</span>
                        </dt>
                        {expandedGlossary[idx] && (
                          <dd>{entry.definition}</dd>
                        )}
                      </div>
                    ))}
                  </dl>
                ) : (
                  paragraphs.map((para, idx) => (
                    <p key={idx} className="teaching-para">
                      {formatTextWithGlossary(para.trim())}
                    </p>
                  ))
                )}
              </div>
            </section>

            {!isGlossary && (
              <p className="dakini-ending">Thus were the Dakini Teachings concealed as treasure.</p>
            )}
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
                        <span className="search-result-chapter">Ch. {result.chapterNum}: {result.chapterName}</span>
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
