import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';

import { Navbar, Nav, Container } from 'react-bootstrap';

const App = () => (
  <BrowserRouter>
    <div className="d-flex flex-column h-100">
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={null} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
