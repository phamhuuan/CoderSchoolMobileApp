import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import allReducers from './src/reducers';
import {name as appName} from './app.json';

// const store = createStore(allReducers, applyMiddleware());

const MobileApp = () => {
	return (
		// <Provider>
			<App />
		// </Provider>
	);
};

AppRegistry.registerComponent(appName, () => MobileApp);
