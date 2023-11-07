const reducer = (state, action) => {
    const { payload = {} } = action;
    const { value } = payload;
    switch (action.type) {
      case 'USER_LOGIN': {
        return {
          ...state,
          userLogin: {
            ...state.userLogin,
            user: value,
          },
        };
      }
      default:
        return state;
    }
  };
  
  export default reducer;