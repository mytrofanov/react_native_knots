import React, {useEffect} from 'react';
import store from './src/store';
import AppNavigator from './src/router';
import {Provider} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

function App() {
    useEffect(() => {
        (async function () {
            await AsyncStorage.removeItem('alreadyLaunched');
        })();
    }, []);
    return (

        <Provider store={store}>
            <AppNavigator/>
        </Provider>

    );
}

export default App;
