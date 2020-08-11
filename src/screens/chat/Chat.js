/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useState, useEffect, useCallback} from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	KeyboardAvoidingView,
	Keyboard,
} from 'react-native';
import {normalize} from '../../utils/Utils';
import Entypo from 'react-native-vector-icons/Entypo';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import {FlatList} from 'react-native';

const fakeData = [
	{text: 'Bắt đầu'},
	{text: 'Xin chào'},
	{text: 'Điểm chuẩn'},
	{text: 'Lịch thi'},
	{text: 'Kết thúc'},
];

const fakeData2 = [
	{text: 'Hãy gọi 1900561252 để liên hệ với chị Thỏ Ngọc'},
	{text: 'Rất vui được hỗ trợ bạn'},
	{
		text:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	},
	{
		text:
			'Hãy truy cập link sau để biết thêm thông tin chi tiết https://google.com',
	},
	{text: 'Hẹn gặp lại bạn vào lần sau'},
];

export default class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			input: '',
			isTyping: false,
			isShowSuggest: true,
		};
	}

	componentDidMount() {
		Keyboard.addListener('keyboardDidShow', this.keyboardDidShow());
		Keyboard.addListener('keyboardDidHide', this.keyboardDidHide());
	}
	// useEffect(() => {
	// 	if (isTyping) {
	// 		return () => {
	// 			const now = new Date().getTime();
	// 			while (new Date().getTime() - now < 5000) {}
	// 			receiveMessage();
	// 		};
	// 	}
	// }, [isTyping, receiveMessage]);
	keyboardDidShow = () => {
		this.setState({isShowSuggest: false});
	};
	keyboardDidHide = () => {
		this.setState({isShowSuggest: true});
	};
	header = () => (
		<View style={styles.header}>
			<View style={{flex: 1}} />
			<Text style={styles.title}>Devil Ducks</Text>
			<View style={{flex: 1, alignItems: 'flex-end'}}>
				<TouchableOpacity style={styles.iconView}>
					<Entypo
						name={'dots-three-vertical'}
						size={24}
						style={styles.icon}
						color={'white'}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);

	renderBubble = (props) => (
		<Bubble
			{...props}
			wrapperStyle={{
				left: {backgroundColor: '#f1f1f1'},
				right: {
					backgroundColor: '#009d9488',
					borderWidth: 1,
					borderColor: '#009d94',
				},
			}}
		/>
	);

	receiveMessage = () => {
		setTimeout(() => {
			let currentData = this.state.data;
			const index = Math.round(Math.random() * 4);
			currentData.unshift({
				text: fakeData2[index].text,
				user: {
					_id: 1,
					name: 'Bot',
				},
				createdAt: new Date().getTime(),
				_id: Math.random(),
			});
			this.setState({data: [...currentData], isTyping: false});
		}, 5000);
	};

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
			this.receiveMessage();
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
						showUserAvatar={false}
						renderAvatar={null}
						isTyping={this.state.isTyping}
						messages={this.state.data}
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
						renderChatFooter={() => {
							if (!this.state.isShowSuggest) {
								return null;
							}
							return (
								<View style={styles.suggestItemView}>
									<FlatList
										data={fakeData}
										horizontal
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
							);
						}}
					/>
				</View>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {flex: 1},
	header: {
		height: normalize(60),
		elevation: 3,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#6600ee',
	},
	title: {
		fontSize: normalize(20),
		fontWeight: 'bold',
		marginLeft: normalize(20),
		color: 'white',
	},
	iconView: {
		width: normalize(40),
		height: normalize(60),
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: normalize(10),
	},
	input: {
		margin: normalize(10),
		marginRight: normalize(10),
		marginLeft: normalize(40),
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#e0e0e0',
		textAlignVertical: 'top',
	},
	chatView: {flex: 1, backgroundColor: '#ffffff'},
	suggestItem: {
		borderRadius: 16,
		backgroundColor: '#6600ee',
		borderWidth: 1,
		borderColor: '#6600ee',
		marginHorizontal: 5,
	},
	suggestItemView: {
		flexDirection: 'row',
		height: 40,
		alignItems: 'center',
	},
	suggestItemText: {color: '#ffffff', padding: 5, paddingHorizontal: 10},
});
