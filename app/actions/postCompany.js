import axios from 'axios';
import { FAIL, LOADING, BASE,POSTCOMPANY} from './types';
import { AsyncStorage } from 'react-native'

export const postCompany = (name, address, cityId, stateId, createdBy, updatedBy, contactNumber ) => {
    return async function (dispatch) {
        
            dispatch({ type: LOADING + POSTCOMPANY });
            let auth = null;
            await AsyncStorage.getItem('auth').then((response) => {
                auth = JSON.parse(response);
            })
                .catch(() => console.log('error'));
            await axios({
                url: BASE + POSTCOMPANY,
                method: 'post',
                headers: { 'Authorization': auth },
                data: {
                    name, address, cityId, stateId, createdBy, updatedBy, contactNumber
                }
            }).then((response) => {
                if (response.data.hasOwnProperty('id')) {
                    dispatch({ type: POSTCOMPANY, payload: response.data })
                }
                else if (response.data.hasOwnProperty('message')) {
                    dispatch({ type: POSTCOMPANY, payload: response.data })
                }
                else {
                    dispatch({ type: FAIL + POSTCOMPANY })
                }
            })
                .catch((e) => dispatch({ type: FAIL + POSTCOMPANY }));
       
       
    }
}

