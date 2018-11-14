import { Navigation } from 'react-native-navigation';
import React from 'react'
import {View,Text} from 'react-native'
// import { Provider } from 'react-redux';
// import store from './store';
// import React from 'react';
// import {AsyncStorage} from 'react-native';
class Cool extends React.Component {
    render(){
        return (
            <View style={{flex:1}}>
                <Text style={{fontSize:30}}>Cool</Text>
            </View>
        )
    }
}
// import EditForms from './screens/EditForms';
// import Home from './screens/Home';
// import Profile from './screens/Profile';
// import Login from './screens/Login';
// import Registration from './screens/Registration';
// import CompReg from './screens/CompReg';
// import CompInfo from './screens/CompInfo';
// import ProductReg from './screens/ProductReg';
// import RecordInfo from './screens/RecordInfo';

Navigation.registerComponent('Home', () => Cool);
// Navigation.registerComponent('Home', () => Home, store, Provider);
// Navigation.registerComponent('Profile', () => Profile);
// Navigation.registerComponent('CompInfo', () => CompInfo);
// Navigation.registerComponent('RecordInfo', () => RecordInfo, store, Provider);
// Navigation.registerComponent('Login', () => Login, store, Provider);
// Navigation.registerComponent('Register', () => Registration, store, Provider);
// Navigation.registerComponent('CompReg', () => CompReg, store, Provider);
// Navigation.registerComponent('ProductReg', () => ProductReg, store, Provider);

// export default async function () {
//     if (await AsyncStorage.getItem('auth')) {
        Navigation.startSingleScreenApp({
            screen: {
                screen: 'Home',
                navigatorStyle: {
                    navBarHidden: true
                },
                appStyle: {
                    keepStyleAcrossPush: true
                },
            }
        });
//     }
//     else {
//         Navigation.startSingleScreenApp({
//             screen: {
//                 screen: 'Login',
//                 navigatorStyle: {
//                     navBarHidden: true
//                 },
//                 appStyle: {
//                     keepStyleAcrossPush: true,
//                 },
//             }
//         });
//     }   
// }
