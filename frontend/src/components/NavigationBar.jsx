import { Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/index.jsx";
import { useTranslation } from "react-i18next";

const NavigationBar = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {t('nav.Hexlet-Chat')}
        </Navbar.Brand>
        {auth.loggedIn && (
          <button type="button" className="btn btn-primary" onClick={() => auth.logOut()}>
            {t('nav.quit')}
          </button>
        )}
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
