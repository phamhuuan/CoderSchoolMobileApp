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
	ScrollView,
} from 'react-native';
import {
	normalize,
	validate_email,
	validate_phone_number,
} from '../../utils/Utils';
import {Input} from 'react-native-elements';
import Colors from '../../constants/Colors';
import Feather from 'react-native-vector-icons/Feather';
import register from '../../api/register';
import addUser from '../../api/addUser';

const Register = ({navigation}) => {
	const [username, setUsername] = useState('');
	const [emailInputValue, setEmailInputValue] = useState('');
	const [phonenumberInputValue, setPhonenumberInputValue] = useState('');
	const [passwordInputValue, setPasswordInputValue] = useState('');
	const [password2InputValue, setPassword2InputValue] = useState('');
	const [hidePassword, setHidePassword] = useState(true);
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

	const onPressRegister = () => {
		if (username.trim() === '') {
			Alert.alert('', 'Bạn phải nhập họ và tên');
			return;
		}
		if (emailInputValue.trim() === '') {
			Alert.alert('', 'Bạn phải nhập email');
			return;
		}
		if (emailInputValue.trim() === '') {
			Alert.alert('', 'Bạn phải nhập số điện thoại');
			return;
		}
		if (passwordInputValue === '') {
			Alert.alert('', 'Bạn phải nhập mật khẩu');
			return;
		}
		if (password2InputValue === '') {
			Alert.alert('', 'Bạn phải nhập lại mật khẩu');
			return;
		}
		if (!validate_email(emailInputValue)) {
			Alert.alert('', 'Email không hợp lệ');
			return;
		}
		if (!validate_phone_number(phonenumberInputValue)) {
			Alert.alert('', 'Số điện thoại không hợp lệ');
			return;
		}
		if (passwordInputValue !== password2InputValue) {
			Alert.alert('', 'Mật khẩu không khớp');
			return;
		}
		register(
			emailInputValue,
			passwordInputValue,
			(user) => {
				addUser(
					{
						user_name: username,
						email: emailInputValue,
						password: passwordInputValue,
						phone_number: phonenumberInputValue,
						user_id: user.uid,
						role: 'user',
					},
					() => {
						navigation.goBack();
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

	const EyeIcon = () => {
		if (hidePassword) {
			return (
				<TouchableOpacity
					onPress={() => {
						setHidePassword(false);
					}}
					style={styles.eyeIcon}>
					<Feather name={'eye'} size={normalize(24)} color={Colors.color_006} />
				</TouchableOpacity>
			);
		} else {
			return (
				<TouchableOpacity
					onPress={() => {
						setHidePassword(true);
					}}
					style={styles.eyeIcon}>
					<Feather
						name={'eye-off'}
						size={normalize(24)}
						color={Colors.color_002}
					/>
				</TouchableOpacity>
			);
		}
	};

	const goToLogin = () => {
		navigation.goBack();
	};

	return (
		<SafeAreaView style={{flex: 1, backgroundColor: Colors.color_007}}>
			<KeyboardAvoidingView
				style={{flex: 1}}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
				<TouchableWithoutFeedback
					style={{flex: 1}}
					onPress={() => {
						Keyboard.dismiss();
					}}>
					<ScrollView>
						<View style={{justifyContent: 'flex-end'}}>
							<View
								style={{
									height: normalize(250),
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								<Animated.View style={{rotation: rotation}}>
									<Image
										source={require('../../../assets/logo3.png')}
										style={{height: normalize(150), width: normalize(150)}}
									/>
								</Animated.View>
								<Text
									style={{
										color: Colors.color_005,
										fontSize: normalize(24),
										fontFamily: 'Comfortaa-Regular',
									}}>
									Chào mừng đến với DuckBot
								</Text>
							</View>
							<View style={styles.loginFormView}>
								<View style={styles.loginTextView}>
									<Text style={styles.loginText}>Đăng kí</Text>
								</View>
								<View style={[styles.inputContainerStyle, styles.inputView]}>
									<Input
										containerStyle={styles.inputContainerStyle}
										inputStyle={styles.inputInputStyle}
										labelStyle={styles.inputLabelStyle}
										inputContainerStyle={styles.inputInputContainerStyle}
										placeholder={'Họ và tên'}
										placeholderTextColor={Colors.color_006}
										label={username === '' ? null : 'Họ và tên'}
										value={username}
										onChangeText={(text) => {
											setUsername(text);
										}}
									/>
								</View>
								<View style={[styles.inputContainerStyle, styles.inputView]}>
									<Input
										containerStyle={styles.inputContainerStyle}
										inputStyle={styles.inputInputStyle}
										labelStyle={styles.inputLabelStyle}
										inputContainerStyle={styles.inputInputContainerStyle}
										placeholder={'Email'}
										placeholderTextColor={Colors.color_006}
										keyboardType={'email-address'}
										label={emailInputValue === '' ? null : 'Email'}
										value={emailInputValue}
										onChangeText={(text) => {
											setEmailInputValue(text);
										}}
									/>
								</View>
								<View style={[styles.inputContainerStyle, styles.inputView]}>
									<Input
										containerStyle={styles.inputContainerStyle}
										inputStyle={styles.inputInputStyle}
										labelStyle={styles.inputLabelStyle}
										inputContainerStyle={styles.inputInputContainerStyle}
										placeholder={'Số điện thoại'}
										placeholderTextColor={Colors.color_006}
										keyboardType={'number-pad'}
										label={
											phonenumberInputValue === '' ? null : 'Số điện thoại'
										}
										value={phonenumberInputValue}
										onChangeText={(text) => {
											setPhonenumberInputValue(text);
										}}
									/>
								</View>
								<View style={[styles.inputContainerStyle, styles.inputView]}>
									<Input
										containerStyle={styles.inputContainerStyle}
										inputStyle={styles.inputInputStyle}
										labelStyle={styles.inputLabelStyle}
										inputContainerStyle={styles.inputInputContainerStyle}
										placeholder={'Mật khẩu'}
										placeholderTextColor={Colors.color_006}
										label={passwordInputValue === '' ? null : 'Mật khẩu'}
										value={passwordInputValue}
										onChangeText={(text) => {
											setPasswordInputValue(text);
										}}
										secureTextEntry={hidePassword}
									/>
									<EyeIcon />
								</View>
								<View style={[styles.inputContainerStyle, styles.inputView]}>
									<Input
										containerStyle={styles.inputContainerStyle}
										inputStyle={styles.inputInputStyle}
										labelStyle={styles.inputLabelStyle}
										inputContainerStyle={styles.inputInputContainerStyle}
										placeholder={'Nhập lại mật khẩu'}
										placeholderTextColor={Colors.color_006}
										label={
											password2InputValue === '' ? null : 'Nhập lại mật khẩu'
										}
										value={password2InputValue}
										onChangeText={(text) => {
											setPassword2InputValue(text);
										}}
										secureTextEntry={hidePassword}
									/>
									<EyeIcon />
								</View>
								<TouchableOpacity
									style={styles.loginButton}
									onPress={onPressRegister}>
									<Text
										style={{
											fontSize: 18,
											color: Colors.color_006,
											fontFamily: 'Comfortaa-Regular',
										}}>
										Đăng kí
									</Text>
								</TouchableOpacity>
								<View style={{width: '90%', flexDirection: 'row'}}>
									<TouchableOpacity
										style={{paddingVertical: normalize(3)}}
										onPress={goToLogin}>
										<Text
											style={{
												color: Colors.color_006,
												fontFamily: 'Comfortaa-Regular',
											}}>
											Đã có tài khoản? Đăng nhập.
										</Text>
									</TouchableOpacity>
								</View>
								<View style={{height: normalize(10)}} />
							</View>
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	inputView: {width: '90%', marginTop: normalize(16)},
	inputContainerStyle: {
		backgroundColor: Colors.color_007,
		borderRadius: 16,
		height: normalize(60),
	},
	inputInputContainerStyle: {borderColor: 'transparent'},
	inputInputStyle: {color: Colors.color_006, fontFamily: 'Comfortaa-Regular'},
	inputLabelStyle: {color: Colors.color_006, fontFamily: 'Comfortaa-Regular'},
	loginButton: {
		marginTop: normalize(16),
		width: '90%',
		backgroundColor: Colors.color_002,
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
	loginText: {
		color: Colors.color_006,
		fontSize: normalize(30),
		fontFamily: 'Comfortaa-Regular',
	},
	loginFormView: {
		backgroundColor: Colors.color_009,
		borderTopRightRadius: 36,
		borderTopLeftRadius: 36,
		alignItems: 'center',
	},
	eyeIcon: {
		position: 'absolute',
		right: normalize(10),
		top: normalize(14),
		padding: normalize(4),
	},
});

export default Register;
