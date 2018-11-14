import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { LOGIN,LOADING,FAIL, BASE,LOGGED } from './types';
import base64 from 'base-64';

export const loginUser = ( email, password ) => {
    return async function(dispatch) {
        dispatch({ type: LOADING+LOGIN });
        console.log('in');
        await axios({
            url: BASE + LOGIN,
            method: 'post',
            headers: { 'Authorization': 'Basic bWFoaWxhcmFzdTQ1QGdtYWlsLmNvbToxMjM0NTY3OA==' },
            data: {
                email, password
            }
        })
            .then(async (response) => {
                if (response.data.email && response.data.password) {
                    let text = response.data.email + ':' + response.data.password;
                    let encoded = await base64.encode(text);
                    let auth = 'Basic ' + encoded;
                    await AsyncStorage.setItem('auth', JSON.stringify(auth));
                    await AsyncStorage.setItem('user', JSON.stringify({email:response.data.email,name:response.data.name}));
                    loginUserSuccess(dispatch, response.data);
                }
                else if (response.data.message === 'Invalid login credentials') {
                    loginUserSuccess(dispatch,response.data);
                }
                else{
                    loginUserfail(dispatch);
                }
            })
            .catch((e) => {loginUserfail(dispatch);});
    };
};

const loginUserfail = (dispatch) => {
    dispatch({ type: FAIL+LOGIN });
};

const loginUserSuccess = (dispatch, response) => {
    dispatch({
        type: LOGIN,
        payload: response
    }); 
};


            
