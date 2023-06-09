import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { fetchData } from "../slices/channelsSlice.js";
import ChannelsList from "./ChannelsList.jsx";
import ChatBody from "./ChatBody.jsx";

const ChatPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData());
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
