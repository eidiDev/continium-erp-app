import {INIT_URL, SIGNOUT_USER_SUCCESS, USER_DATA, USER_TOKEN_SET, USER_TYPE_SET} from "../../constants/ActionTypes";

const INIT_STATE = {
  token: JSON.parse(localStorage.getItem('token')),
  initURL: '',
  authUser: JSON.parse(localStorage.getItem('user')),
  role: JSON.parse(localStorage.getItem('role'))
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {


    case INIT_URL: {
      return {...state, initURL: action.payload};
    }

    case SIGNOUT_USER_SUCCESS: {
      return {
        ...state,
        token: null,
        authUser: null,
        role: null,
        initURL: ''
      }
    }

    case USER_DATA: {
      return {
        ...state,
        authUser: action.payload,
      };
    }

    case USER_TOKEN_SET: {
      return {
        ...state,
        token: action.payload,
      };
    }

    case USER_TYPE_SET: {
      return {
        ...state,
        role: action.payload,
      };
    }

    default:
      return state;
  }
}
