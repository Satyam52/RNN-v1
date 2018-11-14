import { combineReducers } from 'redux';
import reducer from './createReducer';
import { GETANSWERS,
         GETCITY,
         GETMODULE,
         GETQUESTION,
         GETSTATE,
         LOGIN,
         REGISTER,
         POSTANSWER, 
         GETCOMPANY,
         GETPICKER,
         POSTCOMPANY,
         POSTPDT} from '../actions/types';
import answers from './answers';
const loading = false; 
const getCity = reducer({ response: [], loading }, GETCITY);
const getAnswers = reducer({ response: [], loading }, GETANSWERS);
const getQuestions = reducer({ response: [], loading }, GETQUESTION);
const getState = reducer({ response: [], loading }, GETSTATE);
const loginReducer = reducer({ response: {}, loading }, LOGIN);
const registerUser = reducer({ response: {}, loading }, REGISTER);
const postAnswer = reducer({ response: {}, loading }, POSTANSWER);
const getModule = reducer({ response: [], loading }, GETMODULE);
const getCompanies = reducer({response: [],loading}, GETCOMPANY);
const getPicker = reducer({ response: [], loading }, GETPICKER);
const postCompany = reducer({ response: {}, loading }, POSTCOMPANY);
const postProduct = reducer({ response: {}, loading }, POSTPDT);

export default combineReducers({
    getCity,
    getAnswers,
    getQuestions,
    getState,
    getCompanies,
    loginReducer,
    registerUser,
    postAnswer,
    getModule,
    answers,
    getPicker,
    postCompany,
    postProduct
});
