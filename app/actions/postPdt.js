import axios from 'axios';
import {AsyncStorage} from 'react-native'
import { FAIL, LOADING, BASE, POSTPDT } from './types';

export const postPdt = (name) => {
    return async function (dispatch) {
            dispatch({ type: LOADING + POSTPDT });
            let auth = null;
            await AsyncStorage.getItem('auth').then((response) => {
                auth = JSON.parse(response);
            })
                .catch(() => console.log('error'));
            await axios({
                url: BASE + POSTPDT,
                method: 'post',
                headers: { 'Authorization': auth },
                data: {
                    name
                }
            }).then((response) => {
                if (response.data.hasOwnProperty('id')) {
                    dispatch({ type: POSTPDT, payload: response.data })
                }
                else if (response.data.hasOwnProperty('message')) {
                    dispatch({ type: POSTPDT, payload: response.data })
                }
                else {
                    dispatch({ type: FAIL + POSTPDT })
                }
            })
                .catch((e) => dispatch({ type: FAIL + POSTPDT }));
        
       
    }
}
