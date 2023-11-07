/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React from 'react';
import { GlobalContext } from '../../context/GlobalState';

const GlobalContextHOC = (NewComponent) => {
  const GlobalConsumer = (props) => {
    GlobalConsumer.propTypes = {
      children: PropTypes.node.isRequired,
    };
    const { children } = props;
    return (
      <GlobalContext.Consumer>
        <NewComponent {...props}>
          {children}
        </NewComponent>
      </GlobalContext.Consumer>
    );
  };
  return GlobalConsumer;
};

export default GlobalContextHOC;