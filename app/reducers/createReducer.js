import { LOADING, FAIL, REGISTER , CLEAR} from '../actions/types';

export default function createReducer(INITIAL_STATE, query) {
    return function (state = {...INITIAL_STATE}, action) {
        switch (action.type) {
            case LOADING + query:
                return { ...state, loading: true };
            case query:
                return { response: action.payload, loading: false };
            case FAIL + query:
                return INITIAL_STATE;
            default:
                return state;
        }
    };
}
