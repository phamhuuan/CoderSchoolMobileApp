/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	KeyboardAvoidingView,
	Image,
	BackHandler,
	FlatList,
} from 'react-native';
import {normalize} from '../../../utils/Utils';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
	GiftedChat,
	Bubble,
	InputToolbar,
	Send,
	Composer,
	MessageText,
	MessageImage,
} from 'react-native-gifted-chat';
import Axios from 'axios';
import ApiString from '../../../constants/ApiString';
import ScreenName from '../../../constants/ScreenName';
import AsyncStorage from '@react-native-community/async-storage';
import {APP_KEY} from '../../../constants/Constants';
import firestore from '@react-native-firebase/firestore';
import Colors from '../../../constants/Colors';
import getChatData from '../../../api/getChatData';
import addChat from '../../../api/addChat';
import Table from '../../../constants/Table';
import getChatWith from '../../../api/getChatWith';
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

const Chat = ({navigation}) => {
	const [data, setData] = useState([]);
	const [newData, setNewData] = useState([]);
	const [input, setInput] = useState('');
	const [isTyping, setIsTyping] = useState(false);
	const [userProfile, setUserProfile] = useState(null);
	const [loadEarlier, setLoadEarlier] = useState(true);
	const [startAfter, setStartAfter] = useState(new Date().getTime());
	const [newItem, setNewItem] = useState(null);
	const [time, setTime] = useState(new Date().getTime());
	const [chatWith, setChatWith] = useState({});
	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				BackHandler.exitApp();
				return true;
			},
		);
		AsyncStorage.getItem(APP_KEY.USER_PROFILE)
			.then((userProfile) => {
				console.log(JSON.parse(userProfile));
				setUserProfile(JSON.parse(userProfile));
			})
			.catch((error) => {});
		return () => {
			backHandler.remove();
		};
	}, []);

	useEffect(() => {
		if (userProfile) {
			getChat();
			getChatWith(userProfile.user_id, (dataChatWith) => {
				setChatWith(dataChatWith);
			});
			firestore()
				.collection(Table.CHAT)
				.doc(userProfile.user_id)
				.collection(Table.CHAT_LIST)
				.orderBy('createdAt', 'desc')
				.where('createdAt', '>=', time)
				.onSnapshot((documentSnapshot) => {
					let dataAfter = [];
					documentSnapshot.forEach((x) => {
						dataAfter.push(x.data());
					});
					setNewData(dataAfter);
				});
		}
	}, [userProfile, getChat, time]);

	useEffect(() => {
		if (isTyping && newItem && !chatWith.chat_with_admin) {
			botAnswer();
		}
	}, [botAnswer, isTyping, newItem, chatWith]);

	const getChat = useCallback(() => {
		if (userProfile) {
			getChatData(
				userProfile.user_id,
				startAfter,
				10,
				(newData, totalChat) => {
					console.log(newData);
					setData([...data, ...newData]);
					setStartAfter(newData[newData.length - 1].createdAt);
					setLoadEarlier(
						totalChat - data.length - newData.length > 0 ? true : false,
					);
				},
				() => {
					setLoadEarlier(false);
				},
			);
		}
	}, [data, startAfter, userProfile]);

	const header = useMemo(
		() => (
			<View style={styles.header}>
				<View style={{width: normalize(24)}} />
				<Image
					source={require('../../../../assets/logo3.png')}
					style={{height: normalize(40), width: normalize(40)}}
				/>
				<Text style={styles.title}>DuckBot</Text>
				<View
					style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
					<TouchableOpacity
						style={styles.iconView}
						onPress={() => {
							firestore()
								.collection(Table.CHAT)
								.doc(userProfile.user_id)
								.update({
									require_chat_with_admin: !chatWith.require_chat_with_admin,
								});
						}}>
						<AntDesign
							name={'bells'}
							size={24}
							style={styles.icon}
							color={
								chatWith.require_chat_with_admin
									? Colors.color_015
									: Colors.color_006
							}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.iconView}
						onPress={() => {
							navigation.navigate(ScreenName.Screen_User_Setting_screen);
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
		),
		[chatWith.require_chat_with_admin, navigation, userProfile],
	);

	const renderBubble = (props) => (
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
						left: {color: Colors.color_006, fontFamily: 'Comfortaa-Regular'},
						right: {color: Colors.color_007, fontFamily: 'Comfortaa-Regular'},
					}}
				/>
			)}
			renderTime={(props2) => null}
		/>
	);

	const renderInputToolbar = (props) => (
		<InputToolbar
			{...props}
			containerStyle={{
				backgroundColor: Colors.color_007,
				borderTopWidth: 0,
				borderWidth: 0,
				paddingVertical: 5,
			}}
			primaryStyle={{
				borderRadius: 22,
				borderWidth: 0,
				marginHorizontal: 10,
				backgroundColor: Colors.color_008,
			}}
			renderComposer={(props2) => (
				<Composer
					{...props2}
					placeholderTextColor={Colors.color_004}
					textInputStyle={{
						color: Colors.color_004,
						fontFamily: 'Comfortaa-Regular',
					}}
				/>
			)}
		/>
	);

	const renderSend = (props) => (
		<Send
			{...props}
			containerStyle={{
				backgroundColor: Colors.color_008,
				alignItems: 'center',
				borderRadius: 22,
			}}
		/>
	);

	const renderImage = (props) => (
		<MessageImage {...props} imageStyle={{width: '95%', alignSelf: 'center'}} />
	);

	const loadEarlierMessage = () => {
		getChat();
	};

	const botAnswer = useCallback(() => {
		if (newItem && userProfile) {
			const newBotItem = {
				text: 'Xin lỗi bạn mình không hiểu',
				user: {
					_id: 'DevilDucks',
					name: 'Bot',
				},
				createdAt: new Date().getTime(),
				_id: Math.random(),
			};
			// const currentData = data;
			// currentData.unshift(newBotItem);
			// setData([...currentData]);
			setIsTyping(false);
			addChat(
				userProfile.user_id,
				newBotItem,
				() => {},
				() => {},
			);
			firestore()
				.collection(Table.CHAT_ANALYSIS)
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
					setNewItem(null);
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
			// 	message: newItem.text,
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
			// 		addChat(
			// 			userProfile.user_id,
			// 			newBotItem,
			// 			() => {
			// 				const currentData = data;
			// 				currentData.unshift(newBotItem);
			// 				setData(currentData);
			// 				setIsTyping(false);
			// 			},
			// 			() => {},
			// 		);
			// 		firestore().collection('CHAT_ANALYSIS').set({
			// 			user_message: newItem.text,
			// 			user_id: newItem._id,
			// 			user_created_at: newItem.createdAt,
			// 			bot_message: newBotItem.text,
			// 			bot_created_at: newBotItem.createdAt,
			// 			intent: response.data[0].intent,
			// 		});
			// 	})
			// 	.catch((error) => {});
		}
	}, [newItem, userProfile]);

	const onSend = async (textInput) => {
		const newItem = {
			text: textInput,
			user: {
				_id: userProfile.user_id,
				name: userProfile.user_name,
			},
			createdAt: new Date().getTime(),
			_id: Math.random(),
		};
		if (data.length + newData.length === 0) {
			firestore()
				.collection(Table.CHAT)
				.doc(userProfile.user_id)
				.set({chat_with_admin: false, require_chat_with_admin: false});
		}
		// const currentData = data;
		// currentData.unshift(newItem);
		setNewItem(newItem);
		// setData([...currentData]);
		setInput('');
		if (!chatWith.chat_with_admin) {
			setIsTyping(true);
		}
		addChat(
			userProfile.user_id,
			newItem,
			() => {},
			(name, message) => {
				console.log(name, message);
			},
		);
	};
	return (
		<KeyboardAvoidingView style={styles.container}>
			{header}
			<View style={[styles.chatView]}>
				<GiftedChat
					onInputTextChanged={(input) => {
						setInput(input);
					}}
					text={input}
					showUserAvatar={true}
					renderAvatar={null}
					isTyping={isTyping}
					messages={[...newData, ...data]}
					marginTop={normalize(60)}
					onSend={() => {
						onSend(input.trim());
					}}
					textInputProps={{
						multiline: true,
					}}
					user={{
						_id: userProfile?.user_id || 0,
					}}
					timeFormat="HH:mm"
					multiline
					loadEarlier={loadEarlier}
					onLoadEarlier={loadEarlierMessage}
					renderBubble={renderBubble}
					renderInputToolbar={renderInputToolbar}
					renderSend={renderSend}
					renderMessageImage={renderImage}
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
											onSend(item.text);
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
};

export default Chat;

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
		fontFamily: 'Comfortaa-Regular',
	},
	iconView: {
		width: normalize(40),
		height: normalize(60),
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: normalize(10),
	},
	chatView: {flex: 1, backgroundColor: Colors.color_007},
	suggestItem: {
		borderRadius: 16,
		marginHorizontal: 5,
		backgroundColor: Colors.color_007,
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
