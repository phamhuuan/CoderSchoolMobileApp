/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, Image, Alert} from 'react-native';
import {normalize} from '../../utils/Utils';
import AsyncStorage from '@react-native-community/async-storage';
import {APP_KEY} from '../../constants/Constants';
import ScreenName from '../../constants/ScreenName';
import {useIsFocused} from '@react-navigation/native';
import Colors from '../../constants/Colors';
import logout from '../../api/logout';

const StartScreen = ({navigation}) => {
	const isFocused = useIsFocused();
	useEffect(() => {
		if (isFocused) {
			AsyncStorage.getItem(APP_KEY.USER_PROFILE)
				.then((userProfile) => {
					if (userProfile === null) {
						navigation.navigate(ScreenName.Screen_Login_screen);
					} else {
						if (!JSON.parse(userProfile).keepLogin) {
							logout(
								() => {
									AsyncStorage.removeItem(APP_KEY.USER_PROFILE);
									navigation.navigate(ScreenName.Screen_Login_screen);
								},
								(name, message) => {
									console.log(name, message);
								},
							);
						} else {
							navigation.navigate(ScreenName.Screen_Chat_screen);
						}
					}
				})
				.catch((error) => {});
		}
		return () => {
			AsyncStorage.getItem(APP_KEY.USER_PROFILE)
				.then((userProfile) => {
					if (userProfile === null) {
					} else if (!JSON.parse(userProfile).keepLogin) {
						logout(
							() => {
								AsyncStorage.removeItem(APP_KEY.USER_PROFILE);
							},
							(name, message) => {
								console.log(name, message);
							},
						);
					}
				})
				.catch((error) => {});
		};
	}, [navigation, isFocused]);
	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: Colors.color_001,
			}}>
			<Image
				source={require('../../../assets/logo.png')}
				style={{height: normalize(250), width: normalize(250)}}
			/>
		</View>
	);
};

export default StartScreen;
