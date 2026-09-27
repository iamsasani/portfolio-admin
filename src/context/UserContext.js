import React from "react";
import { showSnackbar } from "../components/Snackbar";

const API_URL = "https://portfolio-api.workwithsasan.workers.dev";

const UserStateContext = React.createContext();
const UserDispatchContext = React.createContext();

const initialState = {
  authenticated: false,
  isFetching: false,
  errorMessage: "",
  currentUser: null,
  loadingInit: true,
};

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        ...action.payload,
        authenticated: true,
        isFetching: false,
        loadingInit: false,
        errorMessage: "",
      };

    case "AUTH_INIT_SUCCESS":
      return {
        ...state,
        authenticated: true,
        currentUser: action.payload.currentUser,
        loadingInit: false,
        isFetching: false,
        errorMessage: "",
      };

    case "AUTH_INIT_ERROR":
      return {
        ...state,
        authenticated: false,
        currentUser: null,
        loadingInit: false,
      };

    case "AUTH_FAILURE":
      return {
        ...state,
        authenticated: false,
        isFetching: false,
        errorMessage: action.payload,
        loadingInit: false,
      };

    case "REGISTER_REQUEST":
    case "RESET_REQUEST":
    case "PASSWORD_RESET_EMAIL_REQUEST":
      return {
        ...state,
        isFetching: true,
        errorMessage: "",
      };

    case "REGISTER_SUCCESS":
    case "RESET_SUCCESS":
    case "PASSWORD_RESET_EMAIL_SUCCESS":
      return {
        ...state,
        isFetching: false,
        errorMessage: "",
      };

    case "SIGN_OUT_SUCCESS":
      return {
        ...state,
        authenticated: false,
        currentUser: null,
        isFetching: false,
        loadingInit: false,
        errorMessage: "",
      };

    default:
      return state;
  }
}

function UserProvider({ children }) {
  const [state, dispatch] = React.useReducer(
    userReducer,
    initialState
  );

  // Check existing admin session when app starts
  React.useEffect(() => {
    doInit()(dispatch);
  }, []);

  const value = React.useMemo(
    () => ({
      ...state,

      // Keep the same API that App.js currently expects
      isAuthenticated: () => state.authenticated,
    }),
    [state]
  );

  return (
    <UserStateContext.Provider value={value}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  const context = React.useContext(UserStateContext);

  if (context === undefined) {
    throw new Error(
      "useUserState must be used within a UserProvider"
    );
  }

  return context;
}

function useUserDispatch() {
  const context = React.useContext(
    UserDispatchContext
  );

  if (context === undefined) {
    throw new Error(
      "useUserDispatch must be used within a UserProvider"
    );
  }

  return context;
}

export {
  UserProvider,
  useUserState,
  useUserDispatch,
  loginUser,
  signOut,
};

// --------------------------------
// Login
// --------------------------------
async function loginUser(
  dispatch,
  username,
  password,
  setIsLoading,
  setError
) {
  setError("");
  setIsLoading(true);

  try {
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid username or password.");
    }

    await doInit()(dispatch);

    setError("");

    return true;
  } catch (error) {
    console.error(error);

    setError(
      error.message || "Unable to connect to the authentication server."
    );

    return false;
  } finally {
    setIsLoading(false);
  }
}

// --------------------------------
// Check current session
// --------------------------------
export function doInit() {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/me`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.authenticated) {
        dispatch({
          type: "AUTH_INIT_ERROR",
        });

        return;
      }

      dispatch({
        type: "AUTH_INIT_SUCCESS",
        payload: {
          currentUser: {
            username: "admin",
          },
        },
      });
    } catch (error) {
      console.error(error);

      dispatch({
        type: "AUTH_INIT_ERROR",
        payload: error,
      });
    }
  };
}

// --------------------------------
// Logout
// --------------------------------
async function signOut(dispatch, navigate) {
  try {
    await fetch(
      `${API_URL}/api/admin/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );
  } catch (error) {
    console.error(error);
  } finally {
    dispatch({
      type: "SIGN_OUT_SUCCESS",
    });

    navigate("/login");
  }
}

// --------------------------------
// Compatibility helpers
// --------------------------------

export function receiveToken() {
  // Not used anymore.
  // Authentication is handled by HttpOnly Cookie.
}

export function authError(payload) {
  return {
    type: "AUTH_FAILURE",
    payload,
  };
}

export function registerUser(
  dispatch,
  login,
  password,
  navigate
) {
  return () => {
    navigate("/login");
  };
}

export function sendPasswordResetEmail() {
  showSnackbar({
    type: "info",
    message:
      "Password reset is managed from the admin backend.",
  });
}

export function verifyEmail(token, navigate) {
  navigate("/login");
}

export function resetPassword(
  token,
  password,
  navigate
) {
  navigate("/login");
}