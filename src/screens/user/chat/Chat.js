/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	KeyboardAvoidingView,
	Image,
	BackHandler,
} from 'react-native';
import {normalize} from '../../../utils/Utils';
import Entypo from 'react-native-vector-icons/Entypo';
import {
	GiftedChat,
	Bubble,
	InputToolbar,
	Send,
	Composer,
	MessageText,
	Time,
} from 'react-native-gifted-chat';
import {FlatList} from 'react-native';
import Axios from 'axios';
import ApiString from '../../../constants/ApiString';
import ScreenName from '../../../constants/ScreenName';
import AsyncStorage from '@react-native-community/async-storage';
import {APP_KEY} from '../../../constants/Constants';
import firestore from '@react-native-firebase/firestore';
import Colors from '../../../constants/Colors';
import getChatData from '../../../api/getChatData';
import addChat from '../../../api/addChat';
const fakeData = [
	{text: 'Cơ sở địa điểm học'},
	{text: 'Hình thức tuyển sinh'},
	{text: 'Thông tin chuyên ngành'},
	{text: 'Tiếng anh dự bị'},
	{text: 'Học phí'},
];

const fakeData2 = [
	'greeting',
	'location',
	'tuition',
	'english',
	'ask_func_bot',
	'advisory',
	'recruitment',
	'info_major',
	'thanks',
	'complain',
	'bye_bye',
	'jobs',
	'love_bot',
	'request_meet_staff',
	'message_method',
	'call_method',
	'user_name',
	'user_birth',
	'user_phone_number',
	'user_school',
	'confirm',
	'out_of_scope',
	'deny',
	'affirm',
	'utter_fallback',
];

export default class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			input: '',
			isTyping: false,
			userProfile: null,
			loadEarlier: true,
			startAfter: new Date().getTime(),
		};
		this.backHandler = null;
	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			BackHandler.exitApp();
			return true;
		});
		AsyncStorage.getItem(APP_KEY.USER_PROFILE)
			.then((userProfile) => {
				console.log(JSON.parse(userProfile));
				this.setState({userProfile: JSON.parse(userProfile)});
				this.getChatData();
			})
			.catch((error) => {});
	}

	getChatData() {
		getChatData(
			this.state.userProfile.user_id,
			this.state.startAfter,
			10,
			(data, totalChat) => {
				this.setState({
					data: [...this.state.data, ...data],
					startAfter: data[data.length - 1].createdAt,
					loadEarlier:
						totalChat - data.length - this.state.data.length > 0 ? true : false,
				});
			},
			() => {
				this.setState({loadEarlier: false});
			},
			(name, message) => {
				console.log(name, message);
			},
		);
	}

	componentWillUnmount() {
		this.backHandler.remove();
	}

	header = () => (
		<View style={styles.header}>
			<View style={{width: normalize(24)}} />
			<Image
				source={require('../../../../assets/logo.png')}
				style={{height: normalize(40), width: normalize(40)}}
			/>
			<Text style={styles.title}>Devil Ducks</Text>
			<View style={{flex: 1, alignItems: 'flex-end'}}>
				<TouchableOpacity
					style={styles.iconView}
					onPress={() => {
						this.props.navigation.navigate(
							ScreenName.Screen_User_Setting_screen,
						);
					}}>
					<Entypo
						name={'dots-three-vertical'}
						size={24}
						style={styles.icon}
						color={Colors.color_006}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);

	renderBubble = (props) => (
		<Bubble
			{...props}
			wrapperStyle={{
				left: {backgroundColor: Colors.color_002},
				right: {backgroundColor: Colors.color_005},
			}}
			renderMessageText={(props2) => (
				<MessageText
					{...props2}
					textStyle={{
						left: {color: Colors.color_006},
						right: {color: Colors.color_007},
					}}
				/>
			)}
			renderTime={(props2) => (
				<Time
					{...props2}
					timeTextStyle={{
						left: {color: Colors.color_006},
						right: {color: Colors.color_007},
					}}
				/>
			)}
		/>
	);

	renderInputToolbar = (props) => (
		<InputToolbar
			{...props}
			containerStyle={{
				backgroundColor: Colors.color_001,
				borderTopWidth: 0,
				borderWidth: 0,
				paddingVertical: 5,
			}}
			primaryStyle={{
				borderRadius: 22,
				borderWidth: 0,
				marginHorizontal: 10,
				backgroundColor: Colors.color_002,
			}}
			renderComposer={(props2) => (
				<Composer
					{...props2}
					placeholderTextColor={Colors.color_004}
					textInputStyle={{color: Colors.color_004}}
				/>
			)}
		/>
	);

	renderSend = (props) => (
		<Send
			{...props}
			containerStyle={{
				backgroundColor: Colors.color_002,
				alignItems: 'center',
				borderRadius: 22,
			}}
		/>
	);

	loadEarlierMessage = () => {
		this.getChatData();
	};

	getTime(time) {
		const now = new Date(time);
		const year = now.getFullYear();
		const month = now.getMonth() + 1;
		const date = now.getDate();
		return `${year}${month}${date}`;
	}

	onSend = async (textInput) => {
		let currentData = this.state.data;
		const newItem = {
			text: textInput,
			user: {
				_id: this.state.userProfile.user_id,
				name: this.state.userProfile.user_name,
			},
			createdAt: new Date().getTime(),
			_id: Math.random(),
		};
		addChat(this.state.userProfile.user_id, newItem);
		currentData.unshift(newItem);
		this.setState({data: [...currentData], input: '', isTyping: true}, () => {
			const newBotItem = {
				text: 'Xin lỗi bạn mình không hiểu',
				user: {
					_id: 'DevilDucks',
					name: 'Bot',
				},
				createdAt: new Date().getTime(),
				_id: Math.random(),
			};
			addChat(this.state.userProfile.user_id, newBotItem);
			firestore()
				.collection('CHAT_ANALYSIS')
				.add({
					user_message: newItem.text,
					user_id: newItem.user._id,
					chat_id: newItem._id,
					user_created_at: newItem.createdAt,
					bot_message: newBotItem.text,
					bot_created_at: newBotItem.createdAt,
					intent: fakeData2[Math.round(Math.random() * (fakeData2.length - 1))],
				})
				.then(() => {
					currentData.unshift(newBotItem);
					this.setState({data: [...currentData], isTyping: false});
				})
				.catch();
			// const config = {
			// 	header: {
			// 		'Content-Type': 'application/json',
			// 		Accept: 'text/plain',
			// 	},
			// };
			// const body = {
			// 	sender: 'Rasa',
			// 	message: textInput,
			// };
			// const url = ApiString.URL_Api_Post_Message;
			// Axios.post(url, body, config)
			// 	.then((response) => {
			// 		const newBotItem = {
			// 			text: response.data[0].text,
			// 			user: {
			// 				_id: 'DevilDucks',
			// 				name: 'Bot',
			// 			},
			// 			createdAt: new Date().getTime(),
			// 			_id: Math.random(),
			// 		};
			// 		firestore()
			// 			.collection('CHAT')
			// 			.doc(this.state.userProfile.user_id)
			// 			.collection('CHAT_LIST')
			// 			.add(newBotItem)
			// 			.then((querySnapshot) => {})
			// 			.catch((error) => {
			// 				console.warn(error);
			// 			});
			// 		firestore().collection('CHAT_ANALYSIS').set({
			// 			user_message: newItem.text,
			// 			user_id: newItem._id,
			// 			user_created_at: newItem.createdAt,
			// 			bot_message: newBotItem.text,
			// 			bot_created_at: newBotItem.createdAt,
			// 			intent: response.data[0].intent,
			// 		});
			// 		currentData.unshift(newBotItem);
			// 		this.setState({data: [...currentData], isTyping: false});
			// 	})
			// 	.catch((error) => {});
		});
	};
	render() {
		return (
			<KeyboardAvoidingView style={styles.container}>
				{this.header()}
				<View style={[styles.chatView]}>
					<GiftedChat
						onInputTextChanged={(input) => {
							this.setState({input});
						}}
						text={this.state.input}
						showUserAvatar={true}
						renderAvatar={null}
						isTyping={this.state.isTyping}
						messages={this.state.data}
						marginTop={normalize(60)}
						onSend={() => {
							this.onSend(this.state.input.trim());
						}}
						textInputProps={{
							multiline: true,
						}}
						user={{
							_id: this.state.userProfile?.user_id || 0,
						}}
						timeFormat="HH:mm"
						multiline
						loadEarlier={this.state.loadEarlier}
						onLoadEarlier={this.loadEarlierMessage}
						renderBubble={this.renderBubble}
						renderInputToolbar={this.renderInputToolbar}
						renderSend={this.renderSend}
						renderChatFooter={() => (
							<View style={styles.suggestItemView}>
								<FlatList
									data={fakeData}
									horizontal
									keyboardShouldPersistTaps={'always'}
									keyExtractor={(item) => item.text}
									renderItem={({item}) => (
										<TouchableOpacity
											style={styles.suggestItem}
											onPress={() => {
												this.onSend(item.text);
											}}>
											<Text style={styles.suggestItemText}>{item.text}</Text>
										</TouchableOpacity>
									)}
								/>
							</View>
						)}
					/>
				</View>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {flex: 1},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 999,
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
	},
	iconView: {
		width: normalize(40),
		height: normalize(60),
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: normalize(10),
	},
	chatView: {flex: 1, backgroundColor: Colors.color_001},
	suggestItem: {
		borderRadius: 16,
		marginHorizontal: 5,
		backgroundColor: Colors.color_001,
		borderColor: Colors.color_005,
		borderWidth: 1,
	},
	suggestItemView: {
		flexDirection: 'row',
		height: 40,
		alignItems: 'center',
		marginBottom: 10,
	},
	suggestItemText: {color: Colors.color_005, padding: 5, paddingHorizontal: 10},
});
