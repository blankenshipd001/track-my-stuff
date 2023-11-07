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

  const searchAddress = (address, callback) => {
    searchText(address).then((response) => response.json())
      .then((result) => {
        callback(result);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error', error);
      });
  };

  const setAddress = (address) => {
    dispatch({
      type: 'SET_ADDRESS',
      payload: { value: address },
    });
  };

  const verifyUser = async (address, callback, offMarket = false) => {
    if (address && !offMarket) {
      dispatch({
        type: 'FETCHING_PROPERTY_DETAILS',
        payload: { value: true },
      });

      fetchPropertyDetails(address)
        .then((data) => data.json())
        .then(async (response) => {
          const { content } = response || {};
          if (content) {
            dispatch({
              type: 'VERIFY_USER',
              payload: { value: true, unableToFetchAddress: false },
            });

            dispatch({
              type: 'FETCH_PROPERTY_DETAILS',
              payload: { value: content },
            });
            callback(content);
            Object.keys(state.propertySummaryFields).forEach((key) => {
              try {
                fillSummaryValue(key, content[key]);
                // eslint-disable-next-line no-console
              } catch (ignore) { console.log(ignore); }
            });
          } else {
            dispatch({
              type: 'VERIFY_USER',
              payload: { value: false, unableToFetchAddress: true },
            });
          }
        })
        .catch(async (err) => {
          // eslint-disable-next-line no-console
          console.error(err);
          dispatch({
            type: 'VERIFY_USER',
            payload: { value: false, unableToFetchAddress: true },
          });
        });
    } else {
      try {
        callback(DummyData);
        dispatch({
          type: 'VERIFY_USER',
          payload: { value: true, unableToFetchAddress: false },
        });
        dispatch({
          type: 'FETCH_PROPERTY_DETAILS',
          payload: { value: DummyData },
        });
      } catch (error) {
        dispatch({
          type: 'VERIFY_USER',
          payload: { value: false, unableToFetchAddress: true },
        });
      }
    }
  };

  return (
    <GlobalContext.Provider value={{
      addFieldValue,
      addCalculatedResults,
      calculatorFields: state.calculatorFields,
      fetchingPropertyDetails: state.fetchingPropertyDetails,
      fillSummaryValue,
      hideModal,
      modal: state.modal,
      propertyDetails: state.propertyDetails,
      propertySummaryFields: state.propertySummaryFields,
      resultsFields: state.resultsFields,
      requestUserLogin,
      removeFieldValue,
      searchAddress,
      setAddress,
      showModal,
      userLogin: state.userLogin,
      verifyUser,
      updateAccessCode,
      logAnalyticEvent,
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