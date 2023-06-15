import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Form,
  Row,
  Col,
  Container,
  Card,
  FloatingLabel,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useRollbar } from '@rollbar/react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import routes from '../routes.js';
import { useAuth } from '../hooks/index.jsx';

const LoginPage = () => {
  const { t } = useTranslation();
  const [authFailed, setAuthFailed] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const rollbar = useRollbar();

  const inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const response = await axios.post(routes.loginPath(), values);
        localStorage.setItem('userId', JSON.stringify(response.data));
        auth.logIn(response.data.username);
        const from = { pathname: '/' };
        navigate(from);
      } catch (err) {
        rollbar.error(err);
        if (err.isAxiosError && err.response?.status === 401) {
          inputEl.current.select();
          setAuthFailed(true);
        } else if (err.message === 'Network Error') {
          toast.error(t('network-error'));
        } else {
          throw err;
        }
      }
    },
  });

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
                  alt={t('login.enter')}
                />
              </div>
              <Form
                onSubmit={formik.handleSubmit}
                className="col-12 col-md-6 mt-3 mt-mb-0"
              >
                <h1 className="text-center mb-4">{t('login.enter')}</h1>
                <Form.Group>
                  <FloatingLabel
                    controlId="username"
                    label={t('login.username')}
                    className="mb-3"
                  >
                    <Form.Control
                      ref={inputEl}
                      name="username"
                      autoComplete="username"
                      required
                      placeholder={t('login.username')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={authFailed}
                      value={formik.values.username}
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group>
                  <FloatingLabel
                    controlId="password"
                    label={t('login.password')}
                    className="mb-3"
                  >
                    <Form.Control
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      placeholder={t('login.password')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={authFailed}
                      value={formik.values.password}
                    />
                    <Form.Control.Feedback tooltip type="invalid">
                      {t('login.invalid-input')}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Button
                  type="submit"
                  variant="outline-primary"
                  className="w-100"
                >
                  {t('login.enter')}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('login.no-account')}</span>
                {' '}
                <a href="/signup">{t('login.registration')}</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
