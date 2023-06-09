import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import cn from "classnames";
import { actions } from "../slices/channelsSlice";
import getModal from '../modals';

const renderModal = (modalInfo, hideModal) => {
  const ModalForm = getModal(modalInfo.type);
  if (!ModalForm) {
    return null;
  }

  return (
    <ModalForm onHide={hideModal} modalInfo={modalInfo} />
  );
};

const ChannelsList = () => {
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.channelsReducer);

  const [modalInfo, setModalInfo] = useState({ type: null, channelName: null });
  const hideModal = () => setModalInfo({ type: null, channelName: null });
  const showModal = (type, channelName = null) => setModalInfo({ type, channelName });

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>Каналы</b>
        <button
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          onClick={() => showModal('adding')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
          </svg>
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {channels.map(({ id, name }) => {
          const buttonClass = cn("w-100", "rounded-0", "text-start", "btn", {
            "btn-secondary": id === currentChannelId,
          });

          return (
            <li className="nav-item w-100" key={id}>
              <button
                type="button"
                className={buttonClass}
                onClick={() => dispatch(actions.changeChannel(id))}
              >
                <span className="me-1">#</span>
                {name}
              </button>
            </li>
          );
        })}
      </ul>
      {renderModal(modalInfo, hideModal)}
    </>
  );
};

export default ChannelsList;
