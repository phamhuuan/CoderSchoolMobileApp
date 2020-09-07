/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
	Text,
	View,
	SafeAreaView,
	Image,
	StyleSheet,
	TouchableOpacity,
	Animated,
	Alert,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
} from 'react-native';
import {normalize} from '../../utils/Utils';
import {Input} from 'react-native-elements';
import ScreenName from '../../constants/ScreenName';
import Colors from '../../constants/Colors';
import login from '../../api/login';
import getUserInfo from '../../api/getUserInfo';
import AsyncStorage from '@react-native-community/async-storage';
import {APP_KEY} from '../../constants/Constants';

const Login = ({navigation}) => {
	const [emailInputValue, setEmailInputValue] = useState('');
	const [passwordInputValue, setPasswordInputValue] = useState('');
	const [keepLogin, setKeepLogin] = useState(true);
	const rotation = new Animated.Value(-30);

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

	const onPressLogin = () => {
		if (emailInputValue.trim() === '') {
			Alert.alert('', 'Bạn phải nhập email');
			return;
		}
		if (passwordInputValue === '') {
			Alert.alert('', 'Bạn phải nhập mật khẩu');
			return;
		}
		login(
			emailInputValue,
			passwordInputValue,
			(user) => {
				getUserInfo(
					user.uid,
					(userInfo) => {
						AsyncStorage.setItem(
							APP_KEY.USER_PROFILE,
							JSON.stringify({...userInfo, keepLogin}),
						).then(() => {
							AsyncStorage.getItem(APP_KEY.USER_PROFILE).then((data) => {
								console.log(data);
							});
						});
						if (userInfo.role === 'user') {
							navigation.navigate(ScreenName.Screen_Chat_screen);
						}
					},
					(name, message) => {
						Alert.alert(name, message);
					},
				);
			},
			(name, message) => {
				Alert.alert(name, message);
			},
		);
	};

	const goToRegister = () => {
		navigation.navigate(ScreenName.Screen_Register_screen);
	};

	return (
		<SafeAreaView style={{flex: 1, backgroundColor: Colors.color_001}}>
			<KeyboardAvoidingView
				style={{flex: 1}}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
				<TouchableWithoutFeedback
					style={{flex: 1}}
					onPress={() => {
						Keyboard.dismiss();
					}}>
					<View style={{flex: 1, justifyContent: 'flex-end'}}>
						<View
							style={{
								height: normalize(300),
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<Animated.View style={{rotation: rotation}}>
								<Image
									source={require('../../../assets/logo.png')}
									style={{height: normalize(200), width: normalize(200)}}
								/>
							</Animated.View>
							<Text style={{color: Colors.color_004, fontSize: normalize(30)}}>
								Devil Ducks
							</Text>
						</View>
						<View style={styles.loginFormView}>
							<View style={styles.loginTextView}>
								<Text style={styles.loginText}>Đăng nhập</Text>
							</View>
							<Input
								containerStyle={styles.inputContainerStyle}
								inputStyle={styles.inputInputStyle}
								labelStyle={styles.inputLabelStyle}
								inputContainerStyle={styles.inputInputContainerStyle}
								placeholder={'Email'}
								placeholderTextColor={Colors.color_002}
								keyboardType={'email-address'}
								label={emailInputValue === '' ? null : 'Email'}
								value={emailInputValue}
								onChangeText={(text) => {
									setEmailInputValue(text);
								}}
							/>
							<Input
								containerStyle={styles.inputContainerStyle}
								inputStyle={styles.inputInputStyle}
								labelStyle={styles.inputLabelStyle}
								inputContainerStyle={styles.inputInputContainerStyle}
								placeholder={'Mật khẩu'}
								placeholderTextColor={Colors.color_002}
								label={passwordInputValue === '' ? null : 'Mật khẩu'}
								value={passwordInputValue}
								onChangeText={(text) => {
									setPasswordInputValue(text);
								}}
								secureTextEntry
							/>
							<TouchableOpacity
								onPress={() => {
									setKeepLogin(!keepLogin);
								}}
								style={{
									marginTop: normalize(5),
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								<Text style={{color: Colors.color_004}}>Duy trì đăng nhập</Text>
								<View style={{width: normalize(5)}} />
								{keepLogin ? (
									<Image
										style={{width: normalize(24), height: normalize(24)}}
										source={require('../../../assets/logo2.png')}
									/>
								) : (
									<View
										style={{
											width: normalize(24),
											height: normalize(24),
											borderWidth: 1,
											borderRadius: 4,
											borderColor: Colors.color_004,
										}}
									/>
								)}
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.loginButton}
								onPress={onPressLogin}>
								<Text style={{fontSize: 18, color: Colors.color_007}}>
									Đăng nhập
								</Text>
							</TouchableOpacity>
							<View style={{width: '90%', flexDirection: 'row'}}>
								<TouchableOpacity
									style={{paddingVertical: normalize(3)}}
									onPress={goToRegister}>
									<Text style={{color: Colors.color_004}}>
										Chưa có tài khoản? Đăng kí.
									</Text>
								</TouchableOpacity>
								<View style={{flex: 1}} />
								<TouchableOpacity style={{paddingVertical: normalize(3)}}>
									<Text style={{color: Colors.color_004}}>Quên mật khẩu?</Text>
								</TouchableOpacity>
							</View>
							<View style={{height: normalize(10)}} />
						</View>
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default Login;

const styles = StyleSheet.create({
	inputContainerStyle: {
		marginTop: normalize(16),
		backgroundColor: Colors.color_004,
		width: '90%',
		borderRadius: 16,
		height: normalize(60),
	},
	inputInputContainerStyle: {borderColor: 'transparent'},
	inputInputStyle: {color: Colors.color_002},
	inputLabelStyle: {color: Colors.color_002},
	loginButton: {
		marginTop: normalize(16),
		width: '90%',
		backgroundColor: Colors.color_005,
		height: normalize(55),
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loginTextView: {
		width: '100%',
		paddingVertical: normalize(10),
		alignItems: 'center',
	},
	loginText: {color: Colors.color_004, fontSize: normalize(30)},
	loginFormView: {
		backgroundColor: Colors.color_002,
		borderTopRightRadius: 36,
		borderTopLeftRadius: 36,
		alignItems: 'center',
	},
});
