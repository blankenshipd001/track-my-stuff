import PropTypes from 'prop-types';
import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';

const initialState = {
  userLogin: {
    isVerified: false,
    user: null,
  },
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions for changing state


  const requestUserLogin = () => {
    logInUser().then((response) => {
      const { user } = response;
      dispatch({
        type: 'USER_LOGIN',
        payload: { value: user },
      });
    })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // eslint-disable-next-line no-console
        console.log('error', errorCode, errorMessage);
      });
  };

  return (
    <GlobalContext.Provider value={{
      requestUserLogin,
    }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GlobalProvider;