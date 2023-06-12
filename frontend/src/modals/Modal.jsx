import { Modal as BootstrapModal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../slices/index.js';
import { getIsModalOpened, getModalType } from '../slices/selectors.js';

import Add from './Add.jsx';
import Remove from './Remove.jsx';
import Rename from './Rename.jsx';

const mapping = {
  adding: Add,
  removing: Remove,
  renaming: Rename,
};

const Modal = () => {
  const dispatch = useDispatch();
  const isOpened = useSelector(getIsModalOpened);
  const modalType = useSelector(getModalType);

  const Component = mapping[modalType];

  const handleClose = () => {
    dispatch(actions.closeModal());
  };

  return (
    <BootstrapModal show={isOpened} onHide={handleClose} centered>
      {Component && <Component handleClose={handleClose} />}
    </BootstrapModal>
  );
};

export default Modal;