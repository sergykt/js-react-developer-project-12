import { Dropdown, ButtonGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import cn from "classnames";
import { getCurrentChannelId } from "../slices/selectors";
import { actions } from "../slices";

const ChannelButton = ({ id, name, removable }) => {
  const dispatch = useDispatch();
  const currentChannelId = useSelector(getCurrentChannelId);
  const isSelected = id === currentChannelId;

  const buttonClass = cn("w-100", "rounded-0", "text-start", "btn", "text-truncate", {
    "btn-secondary": isSelected,
  });
  const toggleVariant = isSelected ? "secondary" : null;

  if (removable) {
    return (
      <Dropdown as={ButtonGroup} className="d-flex">
        <button
          type="button"
          className={buttonClass}
          onClick={() => dispatch(actions.changeChannel(id))}
        >
          <span className="me-1">#</span>
          {name}
        </button>
        <Dropdown.Toggle
          className="flex-grow-0"
          split
          variant={toggleVariant}
        />
        <Dropdown.Menu>
          <Dropdown.Item href="#" onClick={() => dispatch(actions.setModalRemove(id))}>Удалить</Dropdown.Item>
          <Dropdown.Item href="#" onClick={() => dispatch(actions.setModalRename(id))}>Переименовать</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={() => dispatch(actions.changeChannel(id))}
    >
      <span className="me-1">#</span>
      {name}
    </button>
  );
};

export default ChannelButton;
