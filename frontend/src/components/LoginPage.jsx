import { useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Container,
  Card,
  FloatingLabel,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../hooks/index.jsx";
import routes from "../routes.js";
import * as yup from "yup";
import axios from "axios";

const generateOnSubmit =
  (setAuthFailed, auth, navigate, location) => async (values) => {
    setAuthFailed(false);
    try {
      const responce = await axios.post(routes.loginPath(), values);
      localStorage.setItem("userId", JSON.stringify(responce.data));
      auth.logIn();
      const from = { pathname: "/" };
      navigate(from);
    } catch (err) {
      setAuthFailed(false);
      if (err.isAxiosError && err.response.status === 401) {
        setAuthFailed(true);
        return;
      }
      throw err;
    }
  };

const LoginPage = () => {
  const [authFailed, setAuthFailed] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const schema = yup.object().shape({
    username: yup.string().trim().required(),
    password: yup.string().trim().required().min(6),
  });

  const onSubmit = generateOnSubmit(
    setAuthFailed,
    auth,
    navigate,
    location,
    schema,
  );

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit,
  });

  const inputEl = useRef();
  useEffect(() => {
    inputEl.current.focus();
  }, []);

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col md={8} xxl={6} xs={12}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src="/img/avatar.jpg"
                  className="rounded-circle"
                  alt="Войти"
                />
              </div>
              <Form
                onSubmit={formik.handleSubmit}
                className="col-12 col-md-6 mt-3 mt-mb-0"
              >
                <h1 className="text-center mb-4">Войти</h1>
                <Form.Group>
                  <FloatingLabel
                    controlId="username"
                    label="Ваш ник"
                    className="mb-3"
                  >
                    <Form.Control
                      ref={inputEl}
                      name="username"
                      autoComplete="username"
                      required
                      placeholder="Ваш ник"
                      onChange={formik.handleChange}
                      isInvalid={authFailed}
                      value={formik.values.username}
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group>
                  <FloatingLabel
                    controlId="password"
                    label="Пароль"
                    className="mb-3"
                  >
                    <Form.Control
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      placeholder="Пароль"
                      onChange={formik.handleChange}
                      isInvalid={authFailed}
                      value={formik.values.password}
                    />
                    <Form.Control.Feedback tooltip type="invalid">
                      Неверные имя или пароль
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Button
                  type="submit"
                  variant="outline-primary"
                  className="w-100"
                >
                  Войти
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
