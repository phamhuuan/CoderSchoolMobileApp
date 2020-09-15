import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ScreenName from '../constants/ScreenName';
import Chat from '../screens/user/chat/Chat';
import Login from '../screens/login/Login';
import StartScreen from '../screens/startScreen/StartScreen';
import UserSetting from '../screens/user/setting/Setting';
import Register from '../screens/register/Register';
import AdminSetting from '../screens/admin/setting/Setting';
import Analysis from '../screens/admin/analysis/Analysis';
import MainChat from '../screens/admin/chat/MainChat';
import AdminChat from '../screens/admin/chat/Chat';

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
				name={ScreenName.Screen_Register_screen}
				component={Register}
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
			<Stack.Screen
				name={ScreenName.Screen_Admin_Setting_screen}
				component={AdminSetting}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name={ScreenName.Screen_Analysis_screen}
				component={Analysis}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name={ScreenName.Screen_Admin_Main_Chat_screen}
				component={MainChat}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name={ScreenName.Screen_Admin_Chat_screen}
				component={AdminChat}
				options={{headerShown: false}}
			/>
		</Stack.Navigator>
	);
}
