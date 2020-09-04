import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ScreenName from '../constants/ScreenName';
import Chat from '../screens/user/chat/Chat';
import Login from '../screens/login/Login';
import StartScreen from '../screens/startScreen/StartScreen';
import UserSetting from '../screens/user/setting/Setting';

const Stack = createStackNavigator();

export default function MainStackNavigation() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name={ScreenName.Screen_Start_screen}
				component={StartScreen}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name={ScreenName.Screen_Login_screen}
				component={Login}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name={ScreenName.Screen_Chat_screen}
				component={Chat}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name={ScreenName.Screen_User_Setting_screen}
				component={UserSetting}
				options={{headerShown: false}}
			/>
		</Stack.Navigator>
	);
}
