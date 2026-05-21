import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LandingPage = () => {
  const navigate = useNavigate();

  // State to handle responsiveness
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [isAdminHovered, setIsAdminHovered] = useState(false);
  const [isGetStartedHovered, setIsGetStartedHovered] = useState(false);
  const [books, setBooks] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setSearchError('');
      setSearchLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTitle.trim()) params.append('title', searchTitle.trim());
        if (searchAuthor.trim()) params.append('author', searchAuthor.trim());
        if (searchCategory.trim()) params.append('category', searchCategory.trim());

        const response = await axios.get(`${API_BASE_URL}/api/books${params.toString() ? `?${params.toString()}` : ''}`);
        setBooks(response.data);
      } catch (error) {
        setSearchError('Unable to load books. Please try again later.');
      } finally {
        setSearchLoading(false);
      }
    };

    fetchBooks();
  }, [searchTitle, searchAuthor, searchCategory]);

  return (
    <div style={containerStyle}>
      {/* Navbar */}
      <nav style={{...navStyle, padding: isMobile ? '20px 5%' : '30px 10%'}}>
        <div style={logoStyle}>...</div>
        <div style={{...navLinksStyle, gap: isMobile ? '15px' : '40px'}}>
          {!isMobile && <span style={linkStyle}>Home</span>}
          {!isMobile && <span style={linkStyle}>About</span>}
          <button 
            onMouseEnter={() => setIsAdminHovered(true)}
            onMouseLeave={() => setIsAdminHovered(false)}
            onClick={() => navigate('/admin-login')} 
            style={{
              ...adminBtnStyle, 
              borderLeft: isMobile ? 'none' : '1px solid #ccc',
              paddingLeft: isMobile ? '0' : '20px',
              color: isAdminHovered ? '#7928ca' : '#333'
            }}>
            Admin Login
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div style={{
        ...contentWrapper, 
        flexDirection: isMobile ? 'column-reverse' : 'row',
        padding: isMobile ? '20px 5%' : '0 10%',
        textAlign: isMobile ? 'center' : 'left',
        gap: isMobile ? '40px' : '0'
      }}>
        <div style={{...leftSection, maxWidth: isMobile ? '100%' : '500px'}} className="fade-in">
          <h2 style={topTagline}>A Digital Solution for Modern Libraries</h2>
          <h1 style={{
            ...titleStyle, 
            fontSize: isMobile ? 'clamp(36px, 10vw, 48px)' : '64px'
          }}>E-Library <br/> Management <br/> System</h1>
          <p style={{...subtitleStyle, fontSize: isMobile ? '16px' : '18px'}}>
            Modernizing traditional libraries by providing a digital solution to store, manage, and access learning resources online.
          </p>
          <button 
            onMouseEnter={() => setIsGetStartedHovered(true)}
            onMouseLeave={() => setIsGetStartedHovered(false)}
            onClick={() => navigate('/get-started')}
            style={{
              ...getStartedBtn,
              width: isMobile ? '100%' : 'auto',
              transform: isGetStartedHovered ? 'translateY(-5px) scale(1.02)' : 'translateY(0)',
              boxShadow: isGetStartedHovered 
                ? '0 15px 30px rgba(79, 172, 254, 0.6)' 
                : '0 10px 20px rgba(79, 172, 254, 0.4)'
            }}>
            Get Started
          </button>
        </div>

        {/* The "Floating 3D" Illustration Side */}
        <div style={{
          ...rightSection, 
          width: isMobile ? '100%' : '500px', 
          height: isMobile ? '300px' : '500px'
        }}>
          <div style={{
            ...floatingCard, 
            width: isMobile ? '200px' : '300px', 
            height: isMobile ? '250px' : '350px'
          }} className="floating-element">
            <div style={{
              fontSize: isMobile ? '60px' : '100px', 
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))'
            }}>📖</div>
            <div style={statusTag}>Resource Catalog</div>
          </div>
          
          <div style={{...circle, top: '10%', right: '10%', width: isMobile ? '40px' : '80px', height: isMobile ? '40px' : '80px', background: '#ff0080', opacity: 0.4}}></div>
          <div style={{...circle, bottom: '20%', left: '5%', width: isMobile ? '30px' : '50px', height: isMobile ? '30px' : '50px', background: '#7928ca'}}></div>
        </div>
      </div>

      <div style={{ ...searchWrapper, padding: isMobile ? '30px 5%' : '40px 10%' }}>
        <h2 style={searchHeading}>Search Books</h2>
        <div style={searchFormStyle}>
          <input
            type="text"
            placeholder="Filter by title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by author"
            value={searchAuthor}
            onChange={(e) => setSearchAuthor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by category"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          />
        </div>

        {searchLoading && <p style={statusText}>Searching books...</p>}
        {searchError && <p style={errorText}>{searchError}</p>}
        {!searchLoading && !searchError && books.length === 0 && (
          <p style={statusText}>No books found. Try different search criteria.</p>
        )}

        <div style={resultsGrid}>
          {books.map((book) => (
            <div key={book._id} style={resultCard}>
              <h3 style={resultTitle}>{book.title}</h3>
              <p style={resultMeta}><strong>Author:</strong> {book.author}</p>
              <p style={resultMeta}><strong>Category:</strong> {book.category || 'Uncategorized'}</p>
              {book.pdfUrl && (
                <a
                  href={`${API_BASE_URL}${book.pdfUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  style={resultLink}
                >
                  Open PDF
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---

const containerStyle = {
  minHeight: '100vh', // Changed to minHeight for mobile scrolling
  width: '100%',
  background: 'linear-gradient(120deg, #e0f7fa 0%, #ffffff 40%, #ffdde1 100%)',
  fontFamily: "'Poppins', sans-serif",
  overflowX: 'hidden', // Prevent horizontal scroll
  display: 'flex',
  flexDirection: 'column'
};

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 10
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: '900',
  color: '#333',
  letterSpacing: '-1px'
};

const navLinksStyle = {
  display: 'flex',
  alignItems: 'center',
  color: '#555',
  fontWeight: '500'
};

const linkStyle = {
  cursor: 'pointer',
  transition: '0.3s'
};

const adminBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '600',
  transition: 'all 0.3s ease'
};

const contentWrapper = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: 1,
  boxSizing: 'border-box'
};

const leftSection = {
  zIndex: 2
};

const topTagline = {
  fontSize: '16px',
  color: '#7928ca',
  fontWeight: '600',
  marginBottom: '10px'
};

const titleStyle = {
  lineHeight: '1.1',
  color: '#2d3436',
  margin: '0 0 20px 0',
  fontWeight: '800'
};

const subtitleStyle = {
  color: '#636e72',
  lineHeight: '1.6',
  marginBottom: '30px'
};

const getStartedBtn = {
  padding: '15px 40px',
  fontSize: '18px',
  background: 'linear-gradient(to right, #00f2fe 0%, #4facfe 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '50px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

const rightSection = {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const floatingCard = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(15px)',
  borderRadius: '30px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 40px 60px rgba(0,0,0,0.1)',
};

const statusTag = {
  marginTop: '20px',
  padding: '8px 20px',
  background: '#fff',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#333',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
};

const searchWrapper = {
  background: '#ffffffee',
  borderRadius: '30px',
  margin: '20px auto',
  width: '100%',
  maxWidth: '1100px',
  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
};

const searchHeading = {
  fontSize: '28px',
  marginBottom: '18px',
  textAlign: 'center',
  color: '#222'
};

const searchFormStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '15px',
  marginBottom: '22px'
};

const statusText = {
  color: '#555',
  textAlign: 'center',
  marginBottom: '20px'
};

const errorText = {
  color: '#c62828',
  textAlign: 'center',
  marginBottom: '20px'
};

const resultsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '18px'
};

const resultCard = {
  background: '#f7fbff',
  borderRadius: '22px',
  padding: '22px',
  border: '1px solid rgba(0, 95, 255, 0.08)'
};

const resultTitle = {
  margin: 0,
  fontSize: '20px',
  color: '#0f172a'
};

const resultMeta = {
  margin: '10px 0 0',
  color: '#334155'
};

const resultLink = {
  display: 'inline-block',
  marginTop: '14px',
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: '600'
};

const circle = {
  position: 'absolute',
  borderRadius: '50%',
  zIndex: 1
};

export default LandingPage;