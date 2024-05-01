/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { firebase } from '@react-native-firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDpC9Za6GHl7lnxZU-ANV5dX2gBPiA43_Y",
    authDomain: "fitness-7c313.firebaseapp.com",
    projectId: "fitness-7c313",
    storageBucket: "fitness-7c313.appspot.com",
    messagingSenderId: "645560539142",
    appId: "1:645560539142:android:8990950a5a87006771cb87",
    measurementId: "8097446403"
    };

    firebase.initializeApp(firebaseConfig);

AppRegistry.registerComponent(appName, () => App);
