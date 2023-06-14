import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import cn from 'classnames';
import leoProfanity from 'leo-profanity';

import { useApi, useAuth } from "../hooks";
import { getChannelMessages, getChannelName, getCurrentChannelId } from "../slices/selectors";

leoProfanity.add(leoProfanity.getDictionary('ru'));
leoProfanity.add(leoProfanity.getDictionary('en'));

const ChatBody = () => {
  const api = useApi();
  const auth = useAuth();
  const { t } = useTranslation();

  const inputEl = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    inputEl.current.focus();
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  });

  const currentChannelId = useSelector(getCurrentChannelId);
  const currentChannel = useSelector(getChannelName);
  const messages = useSelector(getChannelMessages);
  const username = auth.username;

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const newMessage = {
        body: values.body.trim(),
        channelId: currentChannelId,
        username,
      };
      try {
        await api.addMessage(newMessage);
        resetForm();
      } catch(err) {
        setSubmitting(false);
      }
    },
  });

  const formGroupClass = cn('input-group', {
    'has-validation': formik.values.body.trim() === '',
  });

  return (
    <div className="d-flex flex-column h-100" >
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b># {currentChannel && currentChannel}</b>
        </p>
        <span className="text-muted">{t('chat.message', { count: messages.length })}</span>
      </div>
      <div id="messages-box" className="chat-messages overflow-auto px-5" ref={chatRef}>
        {messages.map(({ username, body, id }) => (
          <div className="text-break mb-2" key={id}>
            <b>{leoProfanity.clean(username)}</b>: {leoProfanity.clean(body)}
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
              aria-label={t('chat.new-message')}
              name="body"
              placeholder={t('chat.enter-message')}
              value={formik.values.body}
              onChange={formik.handleChange}
              className="border-0 p-0 ps-2"
              disabled={formik.isSubmitting}
            />
            <button
              type="submit"
              disabled={formik.values.body.trim() === '' || formik.isSubmitting}
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
              <span className="visually-hidden">{t('chat.send')}</span>
            </button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default ChatBody;
