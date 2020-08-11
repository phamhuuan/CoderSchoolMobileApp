import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ScreenName from '../constants/ScreenName';
import Chat from '../screens/chat/Chat';

const Stack = createStackNavigator();

export default function MainStackNavigation() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name={ScreenName.Screen_Chat_screen}
				component={Chat}
				options={{headerShown: false}}
			/>
		</Stack.Navigator>
	);
}
