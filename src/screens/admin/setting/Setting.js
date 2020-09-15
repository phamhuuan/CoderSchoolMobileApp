/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	Alert,
	Animated,
	Image,
	BackHandler,
} from 'react-native';
import {normalize} from '../../../utils/Utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import {APP_KEY} from '../../../constants/Constants';
import Colors from '../../../constants/Colors';
import logout from '../../../api/logout';

const Setting = ({navigation}) => {
	const rotation = new Animated.Value(-30);
	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				navigation.goBack();
				return true;
			},
		);
		return () => {
			backHandler.remove();
		};
	}, [navigation]);
	useEffect(() => {
		const duckAnimation = () => {
			Animated.stagger(1000, [
				Animated.timing(rotation, {
					duration: 1000,
					toValue: 30,
					useNativeDriver: false,
				}),
				Animated.timing(rotation, {
					duration: 1000,
					toValue: -30,
					useNativeDriver: false,
				}),
			]).start();
		};
		const interval = setInterval(() => {
			duckAnimation();
		}, 2000);
		return () => {
			clearInterval(interval);
		};
	}, [rotation]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.iconView}
					onPress={() => {
						navigation.goBack();
					}}>
					<Ionicons
						name={'arrow-back'}
						size={normalize(36)}
						color={Colors.color_006}
					/>
				</TouchableOpacity>
				<Text style={styles.title}>Tài khoản</Text>
			</View>
			<View
				style={{
					height: normalize(300),
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<Animated.View style={{rotation: rotation}}>
					<Image
						source={require('../../../../assets/logo3.png')}
						style={{height: normalize(200), width: normalize(200)}}
					/>
				</Animated.View>
			</View>
			<View>
				<TouchableOpacity style={styles.choice} onPress={() => {}}>
					<Text style={styles.choiceText}>Thông tin cá nhân</Text>
				</TouchableOpacity>
			</View>
			<View>
				<TouchableOpacity style={styles.choice} onPress={() => {}}>
					<Text style={styles.choiceText}>Đổi mật khẩu</Text>
				</TouchableOpacity>
			</View>
			<View>
				<TouchableOpacity
					style={styles.choice}
					onPress={() => {
						logout(
							() => {
								AsyncStorage.removeItem(APP_KEY.USER_PROFILE);
								navigation.popToTop();
							},
							(name, message) => {
								Alert.alert(name, message);
							},
						);
					}}>
					<Text style={[styles.choiceText, {color: Colors.color_015}]}>
						Đăng xuất
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {flex: 1, backgroundColor: Colors.color_007},
	header: {
		height: normalize(60),
		elevation: 3,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.color_003,
	},
	title: {
		fontSize: normalize(20),
		marginLeft: normalize(20),
		color: Colors.color_006,
		fontFamily: 'Comfortaa-Regular',
	},
	iconView: {
		width: normalize(40),
		height: normalize(60),
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: normalize(10),
	},
	choice: {
		height: normalize(60),
		justifyContent: 'center',
		paddingHorizontal: normalize(18),
		borderBottomWidth: 1,
		backgroundColor: Colors.color_007,
	},
	choiceText: {
		fontSize: 18,
		fontFamily: 'Comfortaa-Regular',
	},
});

export default Setting;
