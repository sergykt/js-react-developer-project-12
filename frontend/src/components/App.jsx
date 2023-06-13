import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

import LoginPage from "./LoginPage.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import ChatPage from "./ChatPage.jsx";
import SignUpPage from "./SignUpPage.jsx";
import NavigationBar from "./NavigationBar.jsx";

import { AuthContext, ApiContext } from "../contexts/index.jsx";
import { useAuth } from "../hooks/index.jsx";

import { socket } from "../socket";
import { actions } from "../slices/index.js";

const AuthProvider = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem("userId"));
  const logState = userId && userId.token;
  const [loggedIn, setLoggedIn] = useState(logState);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem("userId");
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const ApiProvider = ({ children }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (!isConnected) {
        toast.error(t('connection-error'));
      }
    }, 10000);

    return () => clearInterval(timerId);
  }, [isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleNewMessage = (payload) => {
      dispatch(actions.addMessage(payload));
    };

    const handleNewChannel = (payload) => {
      dispatch(actions.addChannel(payload));
      dispatch(actions.changeChannel(payload.id));
    };

    const handleRenameChannel = (payload) => {
      dispatch(actions.renameChannel(payload));
    };

    const handleRemoveChannel = (payload) => {
      dispatch(actions.removeChannel(payload));
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("newMessage", handleNewMessage);
    socket.on("newChannel", handleNewChannel);
    socket.on("renameChannel", handleRenameChannel);
    socket.on("removeChannel", handleRemoveChannel);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("newMessage", handleNewMessage);
      socket.off("newChannel", handleNewChannel);
      socket.off("renameChannel", handleRenameChannel);
      socket.off("removeChannel", handleRemoveChannel);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addChannel = (data) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        socket.emit("newChannel", data, (response) => {
          if (response.status === "ok") {
            resolve();
          } else {
            reject(response.error);
          }
        });
      }, 200);

      setTimeout(() => reject(), 3000);
    });

  const renameChannel = (data) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        socket.emit("renameChannel", data, (response) => {
          if (response.status === "ok") {
            resolve();
          } else {
            reject(response.error);
          }
        });
      }, 200);

      setTimeout(() => reject(), 3000);
    });

  const removeChannel = (data) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        socket.emit("removeChannel", data, (response) => {
          if (response.status === "ok") {
            resolve();
          } else {
            reject(response.error);
          }
        });
      }, 200);

      setTimeout(() => reject(), 3000);
    });

  const addMessage = (data) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        socket.emit("newMessage", data, (response) => {
          if (response.status === "ok") {
            resolve();
          } else {
            reject(response.error);
          }
        });
      }, 40);

      setTimeout(() => reject(), 3000);
    });

  const api = { addChannel, addMessage, renameChannel, removeChannel };

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return auth.loggedIn ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

const App = () => {
  return (
    <ApiProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="d-flex flex-column h-100">
            <NavigationBar />
            <Routes>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <ChatPage />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
      <ToastContainer />
    </ApiProvider>
  );
};

export default App;
