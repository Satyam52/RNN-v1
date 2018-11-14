import axios from 'axios';
import { AsyncStorage, NetInfo, Alert } from 'react-native';
import base64 from 'base-64';
import store from '../store'
import { FAIL, LOADING, BASE, GETCITY, GETSTATE, GETQUESTION, GETANSWERS, POSTANSWER, QUESTIONS, RECORDS,CITIES,STATES,COMPANIES, GETCOMPANY, POSTCOMPANY,  GETDROPDOWN, PICKER, GETPICKER, POSTPDT } from './types';
import {realm} from '../realm';

var uid = require('react-native-uuid');

const Processfail = (dispatch, query) => {
    dispatch({ type: FAIL + query });
};

const ProcessSuccess = (dispatch, response, query) => {
    dispatch({
        type: query,
        payload: response
    });
};

const postAnswer = async (rR,auth) => {
        let { createdBy, updatedBy, createdAt, updatedAt, hash, answers } = rR;
        await axios({
            url: BASE + POSTANSWER,
            method: 'post',
            headers: { 'Authorization': auth },
            data: {
                moduleId: 1,
                submissionHash: hash,
                createdBy,
                updatedBy,
                answers: [...answers.map(({
                    questionId,
                    answer }) => {
                    return ({
                        questionId,
                        answer
                    });
                })]
            }
        })
            .then((response) => {
                if (response.data.message === "Answer submitted successfully") {
                    realm.write(() => {
                        rR.hash = response.data.submissionHash;
                    });
                }
                else{
                    console.log('error posting data');
                }
            })
            .catch((e) => console.log(e));
}

const createRecord = (nR) => {
    const { createdBy, updatedBy, createdAt, updatedAt, hash, answers } = nR;
        let uuid = uid.v1();
        realm.write(() => {
            realm.create(RECORDS, {
                createdBy, updatedBy, createdAt, updatedAt, hash, uuid, answers: [...answers.map(({
                    questionId,
                    answer }) => {
                    return ({
                        questionId,
                        answer
                    });
                })]
            });
    });     
};

const updateRecord = (nR, rR, auth) => {
        if (rR.updatedAt.toString() > nR.updatedAt.toString()) {
            postAnswer(rR, auth);
        }
        else if (nR.updatedAt.toString() > rR.updatedAt.toString()) {
            realm.write(() => {
                realm.delete(rR);
            });
            createRecord(nR);
        }
};

const computeCompanies = (response,companies) => {
    try {
        response.data.forEach((element) => {
            let rR = companies.filtered('id = "' + element.id + '"');
            if (rR.length == 0) {
                realm.write(() => {
                    realm.create(COMPANIES, element);
                });
            }
        });
        companies.forEach((r) => {
            if (!(response.data.find(x => x.id == r.id))) {
                realm.write(() => {
                    r.id = 0;
                });
            }
        });
        let dR = companies.filtered('id = "0"');
        if (dR.length) {
            realm.write(() => {
                realm.delete(dR);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

const computeAnswers = (newRecords,realmRecords,auth) => {
    newRecords.forEach((nR) => {
        let rR = realmRecords.filtered('hash = "' + nR.hash + '"');
        if (rR.length) {
            updateRecord(nR, rR[0], auth);
        }
        else {
            createRecord(nR);
        }
    });
    let uR = realmRecords.filtered('hash = "newRecord"');
    if (uR.length) {
        uR.forEach((r) => {
            postAnswer(r, auth);
        });
    }
    realmRecords.forEach((r) => {
        if (!(r.hash == 'newRecord' || newRecords.find(x => x.hash === r.hash)))
        {
            realm.write(() => {
                r.hash = "delete";
            });
        }         
    });
    let dR = realmRecords.filtered('hash = "delete"');
    if (dR.length) {
        realm.write(() => {
            realm.delete(dR);
        });
    }
}

const commonQuery = async (dispatch,query,auth,realmCaption) => {
    let data = realm.objects(realmCaption);
    await axios({
        url: BASE + query,
        method: 'get',
        headers: { 'Authorization': auth }
    }).then(response => {
        if(response.data.length != data.length){
            realm.write(() => {
                realm.delete(data);
                response.data.forEach(element => {
                    realm.create(realmCaption, element);
                });
            });
        }
        ProcessSuccess(dispatch, data, query);
    })
        .catch(() => ProcessSuccess(dispatch, data, query));
}

const computePickers = async (response,pickers,element) => {
    let currentPicker = await pickers.filtered('questionId="' + element.id + '"');
    if (currentPicker.length) {
        if (currentPicker[0].dropdowns.length != response.data.length) {
            realm.write(() => {
                realm.delete(currentPicker);
                realm.create(PICKER, { question: element.question, moduleId: parseInt(element.moduleId), questionId: parseInt(element.id), dropdowns: response.data });
            });
        }
    }
    else {
        realm.write(() => {
            realm.create(PICKER, { question: element.question, moduleId: parseInt(element.moduleId), questionId: parseInt(element.id), dropdowns: response.data });
        });
    }    
}

export const getRequest = (query) => {
    return async (dispatch) => {
        dispatch({ type: LOADING + query });
        let auth = null;
        if (query === GETCITY || query === GETSTATE) {
            let encoded =await base64.encode('mahilarasu45@gmail.com:12345678');
            auth = 'Basic ' + encoded;
        }
        else {
            await AsyncStorage.getItem('auth').then((response) => {
                auth = JSON.parse(response);
            })
                .catch(() => console.log('error'));
        }
        if(query === GETCITY){
            commonQuery(dispatch, query, auth, CITIES);
        }
        else if (query === GETSTATE) {
            commonQuery(dispatch, query, auth, STATES);
        }
        else if (query === GETQUESTION) {
            commonQuery(dispatch, query, auth, QUESTIONS);
        }
        else if (query === GETCOMPANY){
            let companies = realm.objects(COMPANIES);
            await axios({
                url: BASE + query,
                method: 'get',
                headers: { 'Authorization': auth }
            }).then(response => {
                computeCompanies(response, companies, auth);
                ProcessSuccess(dispatch, companies.sorted('createdAt'), query);
            }
            ).catch(() => ProcessSuccess(dispatch, companies.sorted('createdAt'), query));
        }
        else if (query === GETANSWERS) {
            let recs = realm.objects(RECORDS);
            await axios({
                url: BASE + query,
                method: 'get',
                headers: { 'Authorization': auth }
            }).then(response => {
                let newRecords = response.data.records;
                let realmRecords = recs;
                computeAnswers(newRecords, realmRecords, auth);
            })
                .catch(() => ProcessSuccess(dispatch, recs.sorted('createdAt', true), query));
            ProcessSuccess(dispatch, recs.sorted('createdAt', true), query);
        }
        else if(query === GETPICKER){
            let pickers = realm.objects(PICKER);
            let qus = await realm.objects(QUESTIONS).filtered('answerDataType="dropDown"');
            if (qus.length) {
                await qus.forEach(async (element) => {
                    await axios({
                        url: BASE + GETDROPDOWN + element.id,
                        method: 'get',
                        headers: { 'Authorization': auth }
                    }).then(async (response) => {
                        if (response.data.length) {
                             computePickers(response,pickers,element);
                        }
                    })
                        .catch((e) => ProcessSuccess(dispatch, pickers, query));
                });
            }
            ProcessSuccess(dispatch, pickers, query);
        }
        else {
            await axios({
                url: BASE + query,
                method: 'get',
                headers: { 'Authorization': auth }
            }).then(response => {
                ProcessSuccess(dispatch, response.data, query);
            })
                .catch(() => Processfail(dispatch, query));
        }
    }
}


