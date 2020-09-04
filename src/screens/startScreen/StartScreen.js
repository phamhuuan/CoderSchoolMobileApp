/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, Image} from 'react-native';
import {normalize} from '../../utils/Utils';
import AsyncStorage from '@react-native-community/async-storage';
import {APP_KEY} from '../../constants/Constants';
import ScreenName from '../../constants/ScreenName';
import {useIsFocused} from '@react-navigation/native';

const StartScreen = ({navigation}) => {
	const isFocused = useIsFocused();
	useEffect(() => {
		if (isFocused) {
			AsyncStorage.getItem(APP_KEY.USER_PROFILE)
				.then((userProfile) => {
					if (userProfile === null) {
						navigation.navigate(ScreenName.Screen_Login_screen);
					} else {
						navigation.navigate(ScreenName.Screen_Chat_screen);
					}
				})
				.catch((error) => {});
		}
	}, [navigation, isFocused]);
	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#18191a',
			}}>
			<Image
				source={require('../../../assets/logo.png')}
				style={{height: normalize(250), width: normalize(250)}}
			/>
		</View>
	);
};

export default StartScreen;
