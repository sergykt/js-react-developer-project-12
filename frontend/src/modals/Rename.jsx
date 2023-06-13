import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { Modal, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import * as yup from "yup";
import { useApi } from "../hooks/index.jsx";
import { useTranslation } from "react-i18next";
import { getChannelsNames, getChannelById, getExtraId } from "../slices/selectors.js";
import { toast } from "react-toastify";

const getValidationSchema = (channels) =>
  yup.object().shape({
    name: yup
      .string()
      .trim()
      .required('modals.required')
      .min(3, 'modals.min')
      .max(20, 'modals.max')
      .notOneOf(channels, 'modals.uniq'),
  });

const Rename = ({ handleClose }) => {
  const api = useApi();
  const { t } = useTranslation();
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
        toast.success(t('channels.renamed'));
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
        <Modal.Title>{t('modals.rename')}</Modal.Title>
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
              {t('modals.channel-name')}
            </FormLabel>
            <FormControl.Feedback type="invalid">
              {t(submitFailed.message)}
            </FormControl.Feedback>
          </FormGroup>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="me-2 btn btn-secondary"
              onClick={handleClose}
            >
              {t('modals.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formik.isSubmitting}
            >
              {t('modals.submit')}
            </button>
          </div>
        </form>
      </Modal.Body>
    </>
  );
};

export default Rename;
