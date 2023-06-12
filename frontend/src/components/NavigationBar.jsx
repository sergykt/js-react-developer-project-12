import { Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/index.jsx";

const NavigationBar = () => {
  const auth = useAuth();

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Hexlet Chat
        </Navbar.Brand>
        {auth.loggedIn && (
          <button type="button" className="btn btn-primary" onClick={() => auth.logOut()}>
            Выйти
          </button>
        )}
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
