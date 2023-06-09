import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { Modal, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import * as yup from "yup";
import { socket } from "../socket";

const Add = ({ onHide }) => {
  const { channels } = useSelector((state) => state.channelsReducer);
  const [submitFailed, setSubmitFailed] = useState({ state: false, message: ''});

  const inputEl = useRef();

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const schema = yup.object().shape({
    name: yup.string().trim().required('Обязательное поле')
      .min(3, 'От 3 до 20 символов').max(20, 'От 3 до 20 символов'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: (values) => {
      try {
        schema.validateSync(values);
        const isRepeat = channels.find((item) => item.name === values.name);
        if (isRepeat) {
          throw new Error('Должно быть уникальным');
        }
        socket.emit('newChannel', { name: values.name }, (response) => {
         console.log(response.status);
        });
        onHide();
      } catch (err) {
        setSubmitFailed({ state: true, message: err.message });
      }
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
              onChange={formik.handleChange}
              value={formik.values.name}
              onBlur={formik.handleBlur}
              isInvalid={submitFailed.state}
            />
            <FormLabel visuallyHidden htmlFor="name">Имя канала</FormLabel>
            <FormControl.Feedback type="invalid">
              {submitFailed.message}
            </FormControl.Feedback>
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
