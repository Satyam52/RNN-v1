import { AsyncStorage, Alert } from 'react-native';
import { LOGIN, LOADING, FAIL, BASE, LOGGED, QUESTIONS, PICKER, RECORDS } from './types';
import { realm } from '../realm';

export const defaultValue = (uuid) => {
    return async function (dispatch) {
        let pickers = await realm.objects(PICKER);
        let questions = await realm.objects(QUESTIONS);
        let records = await realm.objects(RECORDS);
        let user = {};
        await AsyncStorage.getItem('user').then((response) => {
            user = JSON.parse(response);
        }).catch(() => console.log('error'));
        if (uuid != 0) {
            let currentRec = await records.filtered('uuid="' + uuid + '"')[0];
            await questions.forEach(async (qus) => {
                let pop = parseInt(qus.id);
                let ans = await currentRec.answers.filtered('questionId="' + pop + '"');
                if (ans.length) {
                    if (qus.question == 'Vendor Company' || qus.answerDataType == 'dropDown') {
                        dispatch({ type: pop, payload: parseInt(ans[0].answer) });
                    }
                    else {
                        dispatch({ type: pop, payload: ans[0].answer });
                    }
                }
            });
        }
        else {
            if (questions) {
                let email = await questions.filtered('question="Email"');
                if (email.length) {
                    dispatch({ type: email[0].id, payload: user.email });
                }
            }
            let company = await questions.filtered('question="Vendor Company"');
            if (company.length) {
                dispatch({ type: company[0].id, payload: 1 });
            }
            let picks = await questions.filtered('answerDataType="dropDown"');
            if (picks.length) {
                await picks.forEach(async (p) => {
                    let currentPicker = await pickers.filtered('questionId="' + p.id + '"');
                    let d = await currentPicker[0].dropdowns;
                    if (d.length && picks.length) {
                        dispatch({ type: p.id, payload: d[0].id });
                    }
                });
            }
        }
    }
}






