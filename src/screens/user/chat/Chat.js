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
const fakeData = [
	{text: 'Cơ sở địa điểm học'},
	{text: 'Hình thức tuyển sinh'},
	{text: 'Thông tin chuyên ngành'},
	{text: 'Tiếng anh dự bị'},
	{text: 'Học phí'},
];

export default class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			input: '',
			isTyping: false,
		};
		this.backHandler = null;
	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			BackHandler.exitApp();
			return true;
		});
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
						color={'#f6f5d7'}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);

	renderBubble = (props) => (
		<Bubble
			{...props}
			wrapperStyle={{
				left: {backgroundColor: '#373737'},
				right: {backgroundColor: '#ffe34f'},
			}}
			renderMessageText={(props2) => (
				<MessageText
					{...props2}
					textStyle={{left: {color: '#f6f5d7'}, right: {color: '#383423'}}}
				/>
			)}
			renderTime={(props2) => (
				<Time
					{...props2}
					timeTextStyle={{left: {color: '#f6f5d7'}, right: {color: '#383423'}}}
				/>
			)}
		/>
	);

	renderInputToolbar = (props) => (
		<InputToolbar
			{...props}
			containerStyle={{
				backgroundColor: '#18191a',
				borderTopWidth: 0,
				borderWidth: 0,
				paddingVertical: 5,
			}}
			primaryStyle={{
				borderRadius: 22,
				borderWidth: 0,
				marginHorizontal: 10,
				backgroundColor: '#373737',
			}}
			renderComposer={(props2) => (
				<Composer
					{...props2}
					placeholderTextColor={'#b2b2b2'}
					textInputStyle={{color: '#b2b2b2'}}
				/>
			)}
		/>
	);

	renderSend = (props) => (
		<Send
			{...props}
			containerStyle={{
				backgroundColor: '#373737',
				alignItems: 'center',
				borderRadius: 22,
			}}
		/>
	);

	onSend = (textInput) => {
		let currentData = this.state.data;
		currentData.unshift({
			text: textInput,
			user: {
				_id: 0,
				name: 'You',
			},
			createdAt: new Date().getTime(),
			_id: Math.random(),
		});
		this.setState({data: [...currentData], input: '', isTyping: true}, () => {
			const config = {
				header: {
					'Content-Type': 'application/json',
					Accept: 'text/plain',
				},
			};
			const body = {
				sender: 'Rasa',
				message: textInput,
			};
			const url = ApiString.URL_Api_Post_Message;
			Axios.post(url, body, config)
				.then((response) => {
					currentData.unshift({
						text: response.data[0].text,
						user: {
							_id: 1,
							name: 'Bot',
						},
						createdAt: new Date().getTime(),
						_id: Math.random(),
					});
					this.setState({data: [...currentData], isTyping: false});
				})
				.catch((error) => {});
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
							_id: 0,
						}}
						timeFormat="HH:mm"
						multiline
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
		backgroundColor: '#18191aee',
	},
	title: {
		fontSize: normalize(20),
		marginLeft: normalize(20),
		color: '#f6f5d7',
	},
	iconView: {
		width: normalize(40),
		height: normalize(60),
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: normalize(10),
	},
	chatView: {flex: 1, backgroundColor: '#18191a'},
	suggestItem: {
		borderRadius: 16,
		marginHorizontal: 5,
		backgroundColor: '#18191a',
		borderColor: '#ffe34f',
		borderWidth: 1,
	},
	suggestItemView: {
		flexDirection: 'row',
		height: 40,
		alignItems: 'center',
		marginBottom: 10,
	},
	suggestItemText: {color: '#ffe34f', padding: 5, paddingHorizontal: 10},
});
