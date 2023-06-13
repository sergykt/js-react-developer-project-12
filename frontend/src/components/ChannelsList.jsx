import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { actions } from "../slices/index.js";
import { getChannels } from "../slices/selectors.js";
import Modal from "../modals/Modal.jsx";
import ChannelButton from "./ChannelButton.jsx";

const ChannelsList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector(getChannels);

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('channels.channels')}</b>
        <button
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          onClick={() => dispatch(actions.setModalAdd())}
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
        {channels.map(({ id, name, removable }) => (
          <li className="nav-item w-100" key={id}>
            <ChannelButton id={id} name={name} removable={removable} />
          </li>
        ))}
      </ul>
      <Modal />
    </>
  );
};

export default ChannelsList;
