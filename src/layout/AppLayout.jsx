import { useEffect, useState, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Form } from 'react-bootstrap';
import { Search, Bell } from 'react-bootstrap-icons';
import './AppLayout.style.css';

function AppLayout() {
  const [showBackground, setShowBackground] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setShowBackground(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (event) => {
    if (event) event.preventDefault();

    const trimmed = keyword.trim();

    if (!trimmed) {
      navigate('/movies');
    } else {
      navigate(`/movies?q=${encodeURIComponent(trimmed)}`);
    }

    setKeyword('');
    setShowSearch(false);
  };

  const toggleSearch = () => {
    if (!showSearch) {
      setShowSearch(true);
      setShowNotifications(false);
    } else {
      handleSearch();
    }
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setShowSearch(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <Navbar
        expand="md"
        className={`navbar fixed-top ${showBackground ? 'scrolled' : ''}`}
        variant="dark"
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="logo">
            <img src="/logo.png" alt="Netflix Logo" className="logo-img" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0 movie-nav" navbarScroll>
              <Nav.Link as={Link} to="/">
                홈
              </Nav.Link>
              <Nav.Link as={Link} to="/movies">
                영화
              </Nav.Link>
              <Nav.Link as={Link} to="/series">
                시리즈
              </Nav.Link>
              <Nav.Link as={Link} to="/mylist">
                내가 찜한 콘텐츠
              </Nav.Link>
            </Nav>

            <Form className="d-flex align-items-center">
              <div className="search-container" ref={searchRef}>
                {showSearch && (
                  <input
                    type="text"
                    className="movie-search-input"
                    placeholder="콘텐츠, 장르, 배우 검색..."
                    autoFocus
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch(e);
                    }}
                  />
                )}
                <Search
                  className="movie-search-icon"
                  size={20}
                  onClick={toggleSearch}
                />
              </div>

              <div className="notification-container" ref={notificationRef}>
                <Bell
                  className="movie-bell-icon"
                  size={22}
                  onClick={toggleNotifications}
                />
                {showNotifications && (
                  <div className="notification-dropdown">
                    <p>새 알림이 없습니다.</p>
                  </div>
                )}
              </div>

              <div className="profile"></div>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="content-wrapper">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
