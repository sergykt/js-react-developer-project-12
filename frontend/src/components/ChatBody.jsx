import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import { Form } from "react-bootstrap";
import cn from 'classnames';
import { socket } from "../socket";
import { actions as messagesActions } from "../slices/messagesSlice";

const ChatBody = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const dispatch = useDispatch();
  const inputEl = useRef();

  useEffect(() => {
    inputEl.current.focus();
  });

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      console.log('есть соединение');
    };
  
    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('проблемы с соединением');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    socket.on('newMessage', (payload) => {
      dispatch(messagesActions.addMessage(payload));
    });
  
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { channels, currentChannelId } = useSelector((state) => state.channelsReducer);
  const { messages } = useSelector((state) => state.messagesReducer);

  const currentChannel = channels.find(({ id }) => id === currentChannelId);
  const channelMessages = messages.filter(({ channelId }) => channelId === currentChannelId);

  const userId = JSON.parse(localStorage.getItem('userId'));
  const { username } = userId;

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: (values, { resetForm }) => {
      const newMessage = {
        body: values.body,
        channelId: currentChannelId,
        username,
      };
      socket.emit('newMessage', newMessage, (response) => {
        console.log(response.status);
      });
    
      resetForm();
    },
  });

  const formGroupClass = cn('input-group', {
    'has-validation': formik.values.body === '',
  });

  return (
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b># {currentChannel && currentChannel.name}</b>
        </p>
        <span className="text-muted">{channelMessages.length} сообщение</span>
      </div>
      <div id="messages-box" className="chat-messages overflow-auto px-5">
        {channelMessages.map(({ username, body, id }) => (
          <div className="text-break mb-2" key={id}>
            <b>{username}</b>: {body}
          </div>
        ))}
      </div>
      <div className="mt-auto px-5 py-3">
        <Form
          onSubmit={formik.handleSubmit}
          className="py-1 border rounded-2"
          noValidate
        >
          <Form.Group className={formGroupClass}>
            <Form.Control
              ref={inputEl}
              aria-label="Новое сообщение"
              name="body"
              placeholder="Введите сообщение..."
              value={formik.values.body}
              onChange={formik.handleChange}
              className="border-0 p-0 ps-2"
              isInvalid={!isConnected}
            />
            <Form.Control.Feedback tooltip type="invalid">
              Ошибка соединения
            </Form.Control.Feedback>
            <button
              type="submit"
              disabled={formik.values.body === ''}
              className="btn btn-group-vertical border-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                />
              </svg>
              <span className="visually-hidden">Отправить</span>
            </button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default ChatBody;
