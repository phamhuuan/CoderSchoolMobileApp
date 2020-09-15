/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
	View,
	Text,
	StyleSheet,
	KeyboardAvoidingView,
	Image,
	BackHandler,
	Pressable,
	Switch,
} from 'react-native';
import {normalize} from '../../../utils/Utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
	GiftedChat,
	Bubble,
	InputToolbar,
	Send,
	Composer,
	MessageText,
	MessageImage,
} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import Colors from '../../../constants/Colors';
import getChatData from '../../../api/getChatData';
import addChat from '../../../api/addChat';
import Table from '../../../constants/Table';
import {useNavigation, useRoute} from '@react-navigation/native';
import getChatWith from '../../../api/getChatWith';

const Chat = () => {
	const [data, setData] = useState([]);
	const [newData, setNewData] = useState([]);
	const [input, setInput] = useState('');
	const [loadEarlier, setLoadEarlier] = useState(true);
	const [startAfter, setStartAfter] = useState(new Date().getTime());
	const [newItem, setNewItem] = useState(null);
	const [time, setTime] = useState(new Date().getTime());
	const [chatWith, setChatWith] = useState({});
	const [switchValue, setSwitchValue] = useState(false);
	const navigation = useNavigation();
	const router = useRoute();
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
		getChat();
		getChatWith(router.params.item.user_id, (dataChatWith) => {
			setChatWith(dataChatWith);
			setSwitchValue(chatWith.chat_with_admin);
		});
		firestore()
			.collection(Table.CHAT)
			.doc(router.params.item.user_id)
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
	}, [time, getChat, router.params.item.user_id, chatWith.chat_with_admin]);

	const getChat = useCallback(() => {
		getChatData(
			router.params.item.user_id,
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
	}, [data, router.params.item.user_id, startAfter]);

	const header = useMemo(
		() => (
			<View style={styles.header}>
				<View style={{width: normalize(24)}} />
				<Pressable
					style={styles.iconView}
					onPress={() => {
						navigation.goBack();
					}}>
					<Ionicons
						name={'arrow-back'}
						size={normalize(36)}
						color={Colors.color_006}
					/>
				</Pressable>
				<Image
					source={require('../../../../assets/logo3.png')}
					style={{height: normalize(40), width: normalize(40)}}
				/>
				<Text style={styles.title}>{router.params.item.user_name}</Text>
				<View style={{flex: 1}} />
				<Switch
					value={switchValue}
					onValueChange={() => {
						firestore()
							.collection(Table.CHAT)
							.doc(router.params.item.user_id)
							.update({
								chat_with_admin: !chatWith.chat_with_admin,
							});
					}}
				/>
			</View>
		),
		[
			chatWith.chat_with_admin,
			navigation,
			router.params.item.user_id,
			router.params.item.user_name,
			switchValue,
		],
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

	const renderInputToolbar = (props) =>
		chatWith.chat_with_admin ? (
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
		) : null;

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

	const onSend = async (textInput) => {
		const newItem = {
			text: textInput,
			user: {
				_id: 'DevilDucks',
				name: 'Bot',
			},
			createdAt: new Date().getTime(),
			_id: Math.random(),
		};
		setNewItem(newItem);
		setInput('');
		addChat(
			router.params.item.user_id,
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
					messages={[...newData, ...data]}
					marginTop={normalize(60)}
					onSend={() => {
						onSend(input.trim());
					}}
					textInputProps={{
						multiline: true,
					}}
					user={{
						_id: 'DevilDucks',
					}}
					timeFormat="HH:mm"
					multiline
					loadEarlier={loadEarlier}
					onLoadEarlier={loadEarlierMessage}
					renderBubble={renderBubble}
					renderInputToolbar={renderInputToolbar}
					renderSend={renderSend}
					renderMessageImage={renderImage}
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
