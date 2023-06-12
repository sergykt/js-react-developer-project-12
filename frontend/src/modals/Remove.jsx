import { useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { useApi } from "../hooks/index.jsx";
import { getExtraId } from "../slices/selectors.js";
import { toast } from "react-toastify";

const Remove = ({ handleClose }) => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const id = useSelector(getExtraId);
  const data = { id };

  const onSubmit = async () => {
    setLoading(true);
    try {
      await api.removeChannel(data);
      toast.success("Канал удален");
      handleClose();
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">Уверены?</p>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="me-2 btn btn-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Отменить
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onSubmit}
            disabled={loading}
          >
            Удалить
          </button>
        </div>
      </Modal.Body>
    </>
  );
};

export default Remove;
