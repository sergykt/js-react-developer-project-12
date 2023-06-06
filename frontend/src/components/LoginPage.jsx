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
import { useFormik } from "formik";
import * as yup from "yup";

const generateOnSubmit = (changeValidState, schema) => async (values) => {
  try {
    const user = await schema.validate(values);
    changeValidState(false);
  } catch (e) {
    changeValidState(true);
  }
};

const LoginPage = () => {
  const [isInvalid, changeValidState] = useState(false);

  const schema = yup.object().shape({
    username: yup.string().trim().min(4).required(),
    password: yup.string().required().min(6),
  });

  const onSubmit = generateOnSubmit(changeValidState, schema);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit,
  });

  const inputEl = useRef();
  useEffect(() => {
    inputEl.current.focus();
  }, []);

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100 mt-3">
        <Col md={8} xxl={6} xs={12}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src="/img/avatar.jpg" class="rounded-circle" alt="Войти" />
              </div>
              <Form
                onSubmit={formik.handleSubmit}
                className="col-12 col-md-6 mt-3 mt-mb-0"
              >
                <h1 class="text-center mb-4">Войти</h1>
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
                      id="username"
                      placeholder="Ваш ник"
                      onChange={formik.handleChange}
                      isInvalid={isInvalid}
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
                      id="password"
                      placeholder="Пароль"
                      onChange={formik.handleChange}
                      isInvalid={isInvalid}
                      value={formik.values.password}
                    />
                    <Form.Control.Feedback type="invalid">
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
