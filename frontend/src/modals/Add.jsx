import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import {
  Modal, FormGroup, FormControl, FormLabel,
} from 'react-bootstrap';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useApi } from '../hooks/index.jsx';
import { getChannelsNames } from '../slices/selectors.js';

const getValidationSchema = (channels) => yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('modals.required')
    .min(3, 'modals.min')
    .max(20, 'modals.max')
    .notOneOf(channels, 'modals.uniq'),
});

const Add = ({ handleClose }) => {
  const api = useApi();
  const { t } = useTranslation();
  const channels = useSelector(getChannelsNames);
  const [submitFailed, setSubmitFailed] = useState({
    state: false,
    message: '',
  });

  const inputEl = useRef();

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const schema = getValidationSchema(channels);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      const { name } = values;
      setSubmitFailed({ state: false, message: '' });
      try {
        schema.validateSync(values);
        await api.addChannel({ name });
        toast.success(t('channels.created'));
        handleClose();
      } catch (err) {
        setSubmitting(false);
        inputEl.current.select();
        if (err.name === 'ValidationError') {
          setSubmitFailed({ state: true, message: err.message });
        }
      }
    },
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.add')}</Modal.Title>
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

export default Add;
