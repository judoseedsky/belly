import './ElElla.css';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function ElElla() {
  const [content, setContent] = useState('');
  const [currentSection, setCurrentSection] = useState('part1');
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [allContent, setAllContent] = useState({});
  const contentRef = useRef(null);

  const sections = [
    { id: 'part1', name: 'The Himalayas', file: 'elella_part1.txt' },
    { id: 'part2', name: 'The Pyrenees', file: 'elella_part2.txt' },
    { id: 'part3', name: 'The Andes', file: 'elella_part3.txt' },
  ];

  // Load current section content
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const section = sections.find(s => s.id === currentSection);
      if (section) {
        try {
          const response = await fetch(`/texts/${section.file}`);
          const text = await response.text();
          setContent(text);
        } catch (err) {
          setContent('Error loading content');
        }
      }
      setLoading(false);
    };
    loadContent();
    // Scroll to top when section changes
    window.scrollTo(0, 0);
  }, [currentSection]);

  // Load all content for search
  const loadAllContent = async () => {
    if (Object.keys(allContent).length > 0) return allContent;
    const contentMap = {};
    await Promise.all(sections.map(async (section) => {
      try {
        const response = await fetch(`/texts/${section.file}`);
        const text = await response.text();
        contentMap[section.id] = text;
      } catch (err) {
        contentMap[section.id] = '';
      }
    }));
    setAllContent(contentMap);
    return contentMap;
  };

  // Highlight search terms
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

  // Search across all sections
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const contentToSearch = Object.keys(allContent).length > 0
      ? allContent
      : await loadAllContent();

    const matches = [];
    sections.forEach((section) => {
      const sectionContent = contentToSearch[section.id] || '';
      const regex = new RegExp(query, 'gi');
      let match;
      while ((match = regex.exec(sectionContent)) !== null) {
        const start = Math.max(0, match.index - 40);
        const end = Math.min(sectionContent.length, match.index + query.length + 40);
        matches.push({
          text: sectionContent.slice(start, end),
          sectionId: section.id,
          sectionName: section.name,
          matchText: query
        });
        if (matches.length >= 30) break;
      }
    });
    setSearchResults(matches);
  };

  const navigateToResult = (result) => {
    if (result.sectionId !== currentSection) {
      setCurrentSection(result.sectionId);
    }
    setActiveSearchTerm(result.matchText);
    setSearchOpen(false);

    setTimeout(() => {
      const highlights = document.querySelectorAll('mark.search-highlight');
      if (highlights.length > 0) {
        highlights[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  // Render paragraphs
  const renderContent = () => {
    if (loading) return <p>Loading...</p>;

    const paragraphs = content.split('\n\n').filter(p => p.trim());

    return paragraphs.map((para, idx) => {
      const trimmed = para.trim();

      // Chapter title
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="chapter-title">{highlightSearch(trimmed.slice(3))}</h2>;
      }

      // Regular paragraph
      return <p key={idx}>{highlightSearch(trimmed)}</p>;
    });
  };

  return (
    <div className="elella-page-wrapper">
      <div className="page-content hymn-page">
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

        <nav className="chapter-nav expanded elella-nav">
          {sections.map(section => (
            <a
              key={section.id}
              href="#"
              onClick={(e) => { e.preventDefault(); setCurrentSection(section.id); }}
              style={currentSection === section.id ? { background: 'rgba(255,255,255,0.3)' } : {}}
            >
              <span className="ch-name">{section.name}</span>
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
          <div className="hymn-text" ref={contentRef}>
            <h1 className="scroll-title">El/Ella</h1>
            <p className="scroll-subtitle">Book of Magic Love</p>
            <p className="scroll-author">Miguel Serrano</p>

            {renderContent()}

            <p className="hymn-attribution">
              Translated from the Spanish by Frank MacShane<br/>
              Harper & Row, 1972
            </p>
          </div>
          <div className="scroll-bottom"></div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="search-overlay">
            <div className="search-panel">
              <div className="search-header">
                <input
                  type="text"
                  placeholder="Search within text..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                />
                <button
                  className="search-close"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  &times;
                </button>
              </div>
              <div className="search-results-panel">
                {searchQuery.length < 2 ? (
                  <p className="search-hint">Type at least 2 characters to search</p>
                ) : searchResults.length === 0 ? (
                  <p className="search-hint">No results found</p>
                ) : (
                  <>
                    <p className="search-count">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found</p>
                    {searchResults.map((result, i) => (
                      <div
                        key={i}
                        className="search-result-item"
                        onClick={() => navigateToResult(result)}
                      >
                        <span className="search-result-section">{result.sectionName}</span>
                        <span className="search-result-text">
                          ...{result.text.replace(/\n/g, ' ')}...
                        </span>
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

export default ElElla;
