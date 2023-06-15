import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useApi } from '../hooks/index.jsx';
import { getExtraId } from '../slices/selectors.js';

const Remove = ({ handleClose }) => {
  const api = useApi();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const id = useSelector(getExtraId);
  const data = { id };

  const onSubmit = async () => {
    setLoading(true);
    try {
      await api.removeChannel(data);
      toast.success(t('channels.removed'));
      handleClose();
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.remove')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modals.are-you-sure')}</p>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="me-2 btn btn-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            {t('modals.cancel')}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onSubmit}
            disabled={loading}
          >
            {t('modals.submit-delete')}
          </button>
        </div>
      </Modal.Body>
    </>
  );
};

export default Remove;
