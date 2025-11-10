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
  const [collapseOpen, setCollapseOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setShowBackground(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 검색 실행
  const handleSearch = (event) => {
    if (event) event.preventDefault();
    const trimmed = keyword.trim();
    navigate(trimmed ? `/movies?q=${encodeURIComponent(trimmed)}` : '/movies');
    setKeyword('');
    setShowSearch(false); // 검색 실행 후에만 input 닫기
    setCollapseOpen(false); // 모바일 메뉴도 닫기
  };

  const toggleSearch = () => {
    setShowSearch(true); // 아이콘 클릭 시 항상 input 보여줌
    setShowNotifications(false);
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
        expanded={collapseOpen}
        onToggle={(open) => setCollapseOpen(open)}
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="logo">
            <img src="/logo.png" alt="Netflix Logo" className="logo-img" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0 movie-nav" navbarScroll>
              <Nav.Link as={Link} to="/" onClick={() => setCollapseOpen(false)}>
                홈
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/movies"
                onClick={() => setCollapseOpen(false)}
              >
                영화
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/series"
                onClick={() => setCollapseOpen(false)}
              >
                시리즈
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/mylist"
                onClick={() => setCollapseOpen(false)}
              >
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
                  onClick={toggleSearch} // 클릭 시 input은 계속 보여짐
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
