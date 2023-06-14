import axios from 'axios';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { actions } from '../slices/index.js';
import ChannelsList from "./ChannelsList.jsx";
import ChatBody from "./ChatBody.jsx";
import { useAuth } from '../hooks/index.jsx';
import { useTranslation } from 'react-i18next';
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
  const auth = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const requestData = async () => {
      try {
        const response = await axios(routes.dataPath(), {
          method: 'GET',
          headers: getAuthHeader(),
        });
    
        dispatch(actions.setInitialState(response.data));
      } catch(err) {
        if (err.isAxiosError && err.response?.status === 401) {
          auth.logOut();
        } else if (err.message === 'Network Error') {
          toast.error(t('network-error'));
        } else {
          throw err;
        }
      }
    };

    requestData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
