/* eslint-disable @typescript-eslint/no-explicit-any */
const reducer = (state: any, action: any) => {
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