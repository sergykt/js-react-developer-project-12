import cn from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../slices/channelsSlice";

const ChannelsList = () => {
  const dispatch = useDispatch();

  const { channels, currentChannelId } = useSelector((state) => state.channelsReducer);

  return (
    <ul
      id="channels-box"
      className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
    >
      {channels.map(({ id, name}) => {
        const buttonClass = cn("w-100", "rounded-0", "text-start", "btn", {
          'btn-secondary': id === currentChannelId,
        });

        return (
          <li className="nav-item w-100" key={id}>
            <button type="button" className={buttonClass} onClick={() => dispatch(actions.changeChannel(id))}>
              <span className="me-1">#</span>
              {name}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ChannelsList;
