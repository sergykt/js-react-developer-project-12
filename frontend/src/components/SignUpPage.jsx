import { useEffect, useRef } from 'react';
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
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import axios from 'axios';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';

const SignUpPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const schema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required('sign-up.required')
      .min(3, 'sign-up.min')
      .max(20, 'sign-up.max'),
    password: yup
      .string()
      .trim()
      .required('sign-up.required')
      .min(6, 'sign-up.password-length'),
    confirmPassword: yup
      .string()
      .trim()
      .oneOf([yup.ref('password')], 'sign-up.password-confirm-error'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: schema,
    onSubmit: async ({ username, password }, { setStatus }) => {
      try {
        const data = { username, password };
        const response = await axios.post(routes.createUserPath(), data);
        localStorage.setItem('userId', JSON.stringify(response.data));
        auth.logIn(response.data.username);
        const from = { pathname: '/' };
        navigate(from);
      } catch (err) {
        rollbar.error(err);
        if (err.isAxiosError && err.response?.status === 409) {
          inputEl.current.select();
          setStatus('sign-up.name-exist');
        } else if (err.message === 'Network Error') {
          toast.error(t('network-error'));
        } else {
          throw err;
        }
      }
    },
  });

  const { errors, touched, status } = formik;

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col md={8} xxl={6} xs={12}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src="/img/avatar_1.jpg"
                  className="rounded-circle"
                  alt={t('sign-up.registration')}
                />
              </div>
              <Form
                onSubmit={formik.handleSubmit}
                className="col-12 col-md-6 mt-3 mt-mb-0"
              >
                <h1 className="text-center mb-4">{t('sign-up.registration')}</h1>
                <Form.Group>
                  <FloatingLabel
                    controlId="username"
                    label={t('sign-up.username')}
                    className="mb-3"
                  >
                    <Form.Control
                      ref={inputEl}
                      name="username"
                      autoComplete="username"
                      required
                      placeholder={t('sign-up.username')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        (errors.username && touched.username) || !!status
                      }
                      value={formik.values.username}
                    />
                    <Form.Control.Feedback tooltip type="invalid">
                      {t(errors.username)}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group>
                  <FloatingLabel
                    controlId="password"
                    label={t('sign-up.password')}
                    className="mb-3"
                  >
                    <Form.Control
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      placeholder={t('sign-up.password')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        (errors.password && touched.password) || !!status
                      }
                      value={formik.values.password}
                    />
                    <Form.Control.Feedback tooltip type="invalid">
                      {t(errors.password)}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group>
                  <FloatingLabel
                    controlId="confirmPassword"
                    label={t('sign-up.confirm-password')}
                    className="mb-3"
                  >
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      autoComplete="current-password"
                      required
                      placeholder={t('sign-up.confirm-password')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        (errors.confirmPassword && touched.confirmPassword)
                        || !!status
                      }
                      value={formik.values.confirmPassword}
                    />
                    <Form.Control.Feedback tooltip type="invalid">
                      {t(errors.confirmPassword) || t(status)}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Button
                  type="submit"
                  variant="outline-primary"
                  className="w-100"
                >
                  {t('sign-up.submit')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
