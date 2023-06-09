import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { Modal, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { socket } from "../socket";

// BEGIN (write your solution here)
const Add = ({ onHide }) => {
  const inputEl = useRef();

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: ({ name }) => {
      socket.emit('newChannel', { name });
      onHide();
    },
  });

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup className="form-group mb-2">
            <FormControl
              ref={inputEl}
              name="name"
              id="name"
              required
              onChange={formik.handleChange}
              value={formik.values.name}
              onBlur={formik.handleBlur}
            />
            <FormLabel visuallyHidden htmlFor="name">Имя канала</FormLabel>
          </FormGroup>
          <div className="d-flex justify-content-end">
            <button type="button" className="me-2 btn btn-secondary" onClick={onHide}>
              Отменить
            </button>
            <button type="submit" className="btn btn-primary">
              Отправить
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
// END
