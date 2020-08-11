/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {Fragment} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MainStackNavigation from './src/navigation/MainStackNavigation';

const App = () => {
	return (
		<NavigationContainer>
			<MainStackNavigation />
		</NavigationContainer>
	);
};

const styles = StyleSheet.create({});

export default App;
