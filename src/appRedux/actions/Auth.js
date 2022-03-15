import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  INIT_URL,
  SIGNOUT_USER_SUCCESS,
  USER_DATA,
  USER_TOKEN_SET,
  USER_TYPE_SET
} from "../../constants/ActionTypes";
import api from '../../util/ApiAdonis';
// import api from '../../util/Api';



export const setInitUrl = (url) => {
  return {
    type: INIT_URL,
    payload: url
  };
};

export const userSignUp = ({email, password, name}) => {
  // console.log(email, password);
  return (dispatch) => {
    dispatch({type: FETCH_START});
    api.post('auth/register', {
        email: email,
        password: password,
        name: name
      }
    ).then(({data}) => {
      // console.log("data-suer signup:", data);
      if (data.result) {
        // console.log(data);
        localStorage.setItem("token", JSON.stringify(data.token.access_token));
        localStorage.setItem("role", JSON.stringify(data.role));
        localStorage.setItem("user", JSON.stringify(data.user));
        api.defaults.headers.common['access-token'] = "Bearer " + data.token.access_token;
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: USER_TOKEN_SET, payload: data.token.access_token});
        dispatch({type: USER_DATA, payload: data.user});
      } else {
        // console.log("payload: data.error", data.error);
        dispatch({type: FETCH_ERROR, payload: "Network Error"});
      }
    }).catch(function (error) {
      dispatch({type: FETCH_ERROR, payload: error.message});
      console.log("Error****:", error.message);
    });
  }
};

export const userSignIn = ({email, password}) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    // console.log(email,password);
    api.post('session', {
        email: email,
        password: password,
      }
    ).then(({data}) => {
      if (data) {
        console.log(data);
        localStorage.setItem("token", JSON.stringify(data.token));
        localStorage.setItem("user", JSON.stringify(data.user.username));
        localStorage.setItem("role", JSON.stringify(data.user.role));

        api.defaults.headers.common['access-token'] = "Bearer " + data.token;
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: USER_TOKEN_SET, payload: data.token});
        dispatch({type: USER_TYPE_SET, payload: data.user.role})
      } else {
        dispatch({type: FETCH_ERROR, payload: data.error});
      }
    }).catch(function (error) {
      dispatch({type: FETCH_ERROR, payload: error.message});
      console.log("Error****:", error.message);
    });
  }
};

export const getUser = () => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    api.post('auth/me',
    ).then(({data}) => {
      // console.log("userSignIn: ", data);
      if (data.result) {
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: USER_DATA, payload: data.user});
      } else {
        dispatch({type: FETCH_ERROR, payload: data.error});
      }
    }).catch(function (error) {
      dispatch({type: FETCH_ERROR, payload: error.message});
      console.log("Error****:", error.message);
    });
  }
};


export const userSignOut = () => {
  return (dispatch) => {
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({type: FETCH_SUCCESS});
      dispatch({type: SIGNOUT_USER_SUCCESS});
    }, 2000);
  }
};
