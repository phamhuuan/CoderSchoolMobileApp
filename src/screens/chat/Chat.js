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
import {GiftedChat, Bubble, InputToolbar, Send} from 'react-native-gifted-chat';
import {FlatList} from 'react-native';
import Axios from 'axios';
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
			isShowSuggest: true,
		};
	}

	componentDidMount() {
		Keyboard.addListener('keyboardDidShow', this.keyboardDidShow());
		Keyboard.addListener('keyboardDidHide', this.keyboardDidHide());
	}

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
				left: {backgroundColor: '#e1e1e1'},
				right: {backgroundColor: '#ff7373'},
			}}
		/>
	);

	renderInputToolbar = (props) => (
		<InputToolbar
			{...props}
			containerStyle={{
				backgroundColor: '#ff7373',
				paddingVertical: 5,
			}}
			primaryStyle={{
				borderRadius: 20,
				borderWidth: 0,
				marginHorizontal: 10,
				backgroundColor: '#e1e1e1',
			}}
		/>
	);

	renderSend = (props) => (
		<Send
			{...props}
			containerStyle={{
				backgroundColor: '#e1e1e1',
				alignItems: 'center',
				borderRadius: 20,
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
			const url = 'http://34.82.215.81/webhooks/rest/webhook';
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
						renderInputToolbar={this.renderInputToolbar}
						renderSend={this.renderSend}
						renderChatFooter={() => {
							if (!this.state.isShowSuggest) {
								return <View />;
							}
							return (
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
		backgroundColor: '#ff7373',
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
	chatView: {flex: 1, backgroundColor: '#3e454d'},
	suggestItem: {
		borderRadius: 16,
		backgroundColor: '#ff7373',
		marginHorizontal: 5,
	},
	suggestItemView: {
		flexDirection: 'row',
		height: 40,
		alignItems: 'center',
		marginBottom: 10,
	},
	suggestItemText: {color: '#ffffff', padding: 5, paddingHorizontal: 10},
});
