import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { Modal, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import * as yup from "yup";
import { useApi } from "../hooks/index.jsx";
import { getChannelsNames, getChannelById, getExtraId } from "../slices/selectors.js";
import { toast } from "react-toastify";

const getValidationSchema = (channels) =>
  yup.object().shape({
    name: yup
      .string()
      .trim()
      .required("Обязательное поле")
      .min(3, "От 3 до 20 символов")
      .max(20, "От 3 до 20 символов")
      .notOneOf(channels, "Должно быть уникальным"),
  });

const Rename = ({ handleClose }) => {
  const api = useApi();

  const channelId = useSelector(getExtraId);
  const channel = useSelector(getChannelById(channelId));
  const channels = useSelector(getChannelsNames);

  const [submitFailed, setSubmitFailed] = useState({
    state: false,
    message: "",
  });

  const inputEl = useRef();

  useEffect(() => {
    inputEl.current.select();
  }, []);

  const schema = getValidationSchema(channels);

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    onSubmit: async (values, { setSubmitting }) => {
      const { name } = values;
      setSubmitFailed({ state: false, message: "" });
      try {
        schema.validateSync(values);
        await api.renameChannel({ name, id: channelId });
        toast.success("Канал переименован");
        handleClose();
      } catch (err) {
        setSubmitting(false);
        inputEl.current.select();
        if (err.name === "ValidationError") {
          setSubmitFailed({ state: true, message: err.message });
        }
      }
    },
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
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
              disabled={formik.isSubmitting}
            />
            <FormLabel visuallyHidden htmlFor="name">
              Имя канала
            </FormLabel>
            <FormControl.Feedback type="invalid">
              {submitFailed.message}
            </FormControl.Feedback>
          </FormGroup>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="me-2 btn btn-secondary"
              onClick={handleClose}
            >
              Отменить
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formik.isSubmitting}
            >
              Отправить
            </button>
          </div>
        </form>
      </Modal.Body>
    </>
  );
};

export default Rename;
