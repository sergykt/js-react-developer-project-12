import { useEffect, useRef } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Container,
  Card,
  FloatingLabel,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../hooks/index.jsx";
import routes from "../routes.js";
import * as yup from "yup";
import axios from "axios";

const generateOnSubmit =
  (auth, navigate) =>
  async ({ username, password }, { setSubmitting, setStatus }) => {
    try {
      const data = { username, password };
      const response = await axios.post(routes.createUserPath(), data);
      localStorage.setItem("userId", JSON.stringify(response.data));
      auth.logIn();
      const from = { pathname: "/" };
      navigate(from);
    } catch (err) {
      setSubmitting(false);
      if (err.isAxiosError && err.response.status === 409) {
        setStatus("Такой пользователь уже существует");
        return;
      }
      throw err;
    }
  };

const SignUpPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required("Обязательное поле")
      .min(3, "От 3 до 20 символов")
      .max(20, "От 3 до 20 символов"),
    password: yup
      .string()
      .trim()
      .required("Обязательное поле")
      .min(6, "Не менее 6 символов"),
    confirmPassword: yup
      .string()
      .trim()
      .oneOf([yup.ref("password")], "Пароли должны совпадать"),
  });

  const onSubmit = generateOnSubmit(auth, navigate);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit,
  });

  const { errors, touched, status } = formik;

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
                  src="/img/avatar_1.jpg"
                  className="rounded-circle"
                  alt="Регистрация"
                />
              </div>
              <Form
                onSubmit={formik.handleSubmit}
                className="col-12 col-md-6 mt-3 mt-mb-0"
              >
                <h1 className="text-center mb-4">Регистрация</h1>
                <Form.Group>
                  <FloatingLabel
                    controlId="username"
                    label="Имя пользователя"
                    className="mb-3"
                  >
                    <Form.Control
                      ref={inputEl}
                      name="username"
                      autoComplete="username"
                      required
                      placeholder="Имя пользователя"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        (errors.username && touched.username) || !!status
                      }
                      value={formik.values.username}
                      disabled={formik.isSubmitting}
                    />
                    <Form.Control.Feedback tooltip type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
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
                      onBlur={formik.handleBlur}
                      isInvalid={
                        (errors.password && touched.password) || !!status
                      }
                      value={formik.values.password}
                      disabled={formik.isSubmitting}
                    />
                    <Form.Control.Feedback tooltip type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group>
                  <FloatingLabel
                    controlId="confirmPassword"
                    label="Подтвердите пароль"
                    className="mb-3"
                  >
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      autoComplete="current-password"
                      required
                      placeholder="Подтвердите пароль"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        (errors.confirmPassword && touched.confirmPassword) ||
                        !!status
                      }
                      value={formik.values.confirmPassword}
                      disabled={formik.isSubmitting}
                    />
                    <Form.Control.Feedback tooltip type="invalid">
                      {errors.confirmPassword || status}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Button
                  type="submit"
                  variant="outline-primary"
                  className="w-100"
                  disabled={formik.isSubmitting}
                >
                  Зарегистрироваться
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
