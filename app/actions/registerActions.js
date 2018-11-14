import axios from 'axios';
import { REGISTER, LOADING, FAIL, BASE } from './types';

export const registerUser = (createdBy,
                             updatedBy,
                             name,
                             dob,
                             address,
                             cityId,
                             stateId,
                             email,
                             password,
                             accessControlId,
                             gender,
                             contactNumber
                            ) => {
    return (dispatch) => {
        dispatch({ type: LOADING + REGISTER });
        axios.post(BASE + REGISTER, {
            createdBy, updatedBy, name, dob, address, cityId, stateId, email, password, accessControlId, gender,
            contactNumber
        })
            .then(response => {
                    REGISTERUserSuccess(dispatch, response.data);
            })
            .catch(() => REGISTERUserfail(dispatch));
    };
};

const REGISTERUserfail = (dispatch) => {
    dispatch({ type: FAIL + REGISTER });
};

const REGISTERUserSuccess = (dispatch, response) => {
    dispatch({
        type: REGISTER,
        payload: response
    });
};



