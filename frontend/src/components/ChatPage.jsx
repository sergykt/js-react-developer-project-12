import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Container } from 'react-bootstrap';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/index.jsx';
import { actions } from '../slices/index.js';
import ChannelsList from './ChannelsList.jsx';
import ChatBody from './ChatBody.jsx';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const ChatPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const auth = useAuth();

  useEffect(() => {
    const requestData = async () => {
      try {
        const response = await axios(routes.dataPath(), {
          method: 'GET',
          headers: getAuthHeader(),
        });

        dispatch(actions.setInitialState(response.data));
      } catch (err) {
        rollbar.error(err);
        if (err.message === 'Network Error') {
          toast.error(t('network-error'));
        } else if (err.isAxiosError && err.response?.status === 401) {
          auth.logOut();
        } else {
          throw err;
        }
      }
    };

    requestData();
  }, []);

  return (
    <Container className="rounded shadow h-100 my-4 overflow-hidden">
      <Row className="h-100 bg-white flex-md-row">
        <Col
          xs={4}
          md={2}
          className="h-100 border-end bg-light px-0 flex-column d-flex"
        >
          <ChannelsList />
        </Col>
        <Col className="h-100 p-0">
          <ChatBody />
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
