/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
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
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import {APP_KEY} from '../../constants/Constants';
import ScreenName from '../../constants/ScreenName';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emailInputValue: '',
			passwordInputValue: '',
		};
		this.rotation = new Animated.Value(-30);
		this.interval = null;
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			this.duckAnimation();
		}, 2000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	duckAnimation() {
		Animated.stagger(1000, [
			Animated.timing(this.rotation, {
				duration: 1000,
				toValue: 30,
				useNativeDriver: false,
			}),
			Animated.timing(this.rotation, {
				duration: 1000,
				toValue: -30,
				useNativeDriver: false,
			}),
		]).start();
	}

	onPressLogin = () => {
		if (this.state.emailInputValue.trim() === '') {
			Alert.alert('', 'Bạn phải nhập email');
			return;
		}
		if (this.state.passwordInputValue === '') {
			Alert.alert('', 'Bạn phải nhập mật khẩu');
			return;
		}
		firestore()
			.collection('USER')
			.where('email', '==', this.state.emailInputValue)
			.get()
			.then((querySnapshot) => {
				if (querySnapshot.docs[0]) {
					if (
						this.state.passwordInputValue ===
						querySnapshot.docs[0]._data.password
					) {
						AsyncStorage.setItem(
							APP_KEY.USER_PROFILE,
							JSON.stringify(querySnapshot.docs[0]._data),
						);
						if (querySnapshot.docs[0]._data.role === 'user') {
							this.props.navigation.navigate(ScreenName.Screen_Chat_screen);
						}
					} else {
						Alert.alert('', 'Sai mật khẩu');
					}
				} else {
					Alert.alert('', 'Tài khoản không tồn tại');
				}
			})
			.catch();
	};

	render() {
		return (
			<SafeAreaView style={{flex: 1, backgroundColor: '#18191a'}}>
				<KeyboardAvoidingView
					style={{flex: 1}}
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
					<TouchableWithoutFeedback
						style={{flex: 1}}
						onPress={() => {
							Keyboard.dismiss();
						}}>
						<View style={{flex: 1}}>
							<View
								style={{
									flex: 1,
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								<Animated.View style={{rotation: this.rotation}}>
									<Image
										source={require('../../../assets/logo.png')}
										style={{height: normalize(150), width: normalize(150)}}
									/>
								</Animated.View>
								<Text style={{color: '#b2b2b2', fontSize: normalize(30)}}>
									Devil Ducks
								</Text>
							</View>
							<View
								style={{
									flex: 1.5,
									backgroundColor: '#373737',
									borderTopRightRadius: 36,
									borderTopLeftRadius: 36,
									alignItems: 'center',
								}}>
								<View
									style={{
										width: '100%',
										paddingVertical: normalize(10),
										alignItems: 'center',
									}}>
									<Text style={{color: '#b2b2b2', fontSize: normalize(30)}}>
										Đăng nhập
									</Text>
								</View>
								<Input
									containerStyle={styles.inputContainerStyle}
									inputStyle={styles.inputInputStyle}
									labelStyle={styles.inputLabelStyle}
									inputContainerStyle={styles.inputInputContainerStyle}
									placeholder={'Email'}
									placeholderTextColor={'#373737'}
									keyboardType={'email-address'}
									label={this.state.emailInputValue === '' ? null : 'Email'}
									value={this.state.emailInputValue}
									onChangeText={(text) => {
										this.setState({emailInputValue: text});
									}}
								/>
								<Input
									containerStyle={styles.inputContainerStyle}
									inputStyle={styles.inputInputStyle}
									labelStyle={styles.inputLabelStyle}
									inputContainerStyle={styles.inputInputContainerStyle}
									placeholder={'Mật khẩu'}
									placeholderTextColor={'#373737'}
									label={
										this.state.passwordInputValue === '' ? null : 'Mật khẩu'
									}
									value={this.state.passwordInputValue}
									onChangeText={(text) => {
										this.setState({passwordInputValue: text});
									}}
									secureTextEntry
								/>
								<TouchableOpacity
									style={styles.loginButton}
									onPress={this.onPressLogin}>
									<Text style={{fontSize: 18, color: '#383423'}}>
										Đăng nhập
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	inputContainerStyle: {
		marginTop: normalize(16),
		backgroundColor: '#b2b2b2',
		width: '90%',
		borderRadius: 16,
		height: normalize(60),
	},
	inputInputContainerStyle: {borderColor: 'transparent'},
	inputInputStyle: {color: '#373737'},
	inputLabelStyle: {color: '#373737'},
	loginButton: {
		marginTop: normalize(16),
		width: '90%',
		backgroundColor: '#ffe34f',
		height: normalize(60),
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
