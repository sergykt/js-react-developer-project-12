import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Provider, ErrorBoundary } from "@rollbar/react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { socket } from "../socket";

import LoginPage from "./LoginPage.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import ChatPage from "./ChatPage.jsx";
import SignUpPage from "./SignUpPage.jsx";
import NavigationBar from "./NavigationBar.jsx";

import { AuthContext, ApiContext } from "../contexts/index.jsx";
import { useAuth } from "../hooks/index.jsx";
import { actions } from "../slices/index.js";

const rollbarConfig = {
  accessToken: "44a12c82641f4a77bf31ab62da668d9f",
  environment: "testenv",
};

const AuthProvider = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem("userId"));
  const name = userId ? userId.username : "";
  const loginState = userId && userId.token;

  const [loggedIn, setLoggedIn] = useState(loginState);
  const [username, setUserName] = useState(name);

  const logIn = (name) => {
    setLoggedIn(true);
    setUserName(name);
  };

  const logOut = () => {
    localStorage.removeItem("userId");
    setLoggedIn(false);
    setUserName("");
  };

  return (
    <AuthContext.Provider value={{ loggedIn, username, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const ApiProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
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

    socket.on("newMessage", handleNewMessage);
    socket.on("newChannel", handleNewChannel);
    socket.on("renameChannel", handleRenameChannel);
    socket.on("removeChannel", handleRemoveChannel);

    return () => {
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
            reject();
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
            reject();
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
            reject();
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
            reject();
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
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
