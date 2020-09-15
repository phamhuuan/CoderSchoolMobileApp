/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useMemo} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	BackHandler,
	FlatList,
	TouchableOpacity,
} from 'react-native';
import {normalize} from '../../../utils/Utils';
import Colors from '../../../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import Table from '../../../constants/Table';
import {useNavigation} from '@react-navigation/native';
import ScreenName from '../../../constants/ScreenName';

const MainChat = () => {
	const [data, setData] = useState([]);
	const navigation = useNavigation();
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
		firestore()
			.collection(Table.CHAT)
			.onSnapshot((documentSnapshot) => {
				let tmp = [];
				documentSnapshot.forEach((x) => {
					tmp.push(x.data());
				});
				setData(tmp);
			});
	}, []);
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
				<Text style={styles.title}>Tin nhắn</Text>
			</View>
		),
		[navigation],
	);
	return (
		<View>
			{header}
			<FlatList
				data={data}
				keyExtractor={(item) => item.user_id}
				renderItem={({item}) => <Item item={item} />}
			/>
		</View>
	);
};

const Item = ({item}) => {
	const [name, setName] = useState('');
	const navigation = useNavigation();
	useEffect(() => {
		firestore()
			.collection(Table.USER)
			.doc(item.user_id)
			.get()
			.then((x) => {
				setName(x.data().user_name);
			});
	}, [item.user_id]);
	return (
		<TouchableOpacity
			onPress={() => {
				navigation.navigate(ScreenName.Screen_Admin_Chat_screen, {
					item: {...item, user_name: name},
				});
			}}>
			<View
				style={{
					width: '100%',
					height: normalize(60),
					borderBottomWidth: 1,
					paddingHorizontal: normalize(16),
					backgroundColor:
						item.chat_with_admin || item.require_chat_with_admin
							? Colors.color_002
							: Colors._007,
				}}>
				<View>
					<Text style={{fontFamily: 'Comfortaa-Regular'}}>{name}</Text>
				</View>
				<View style={{flex: 1}} />
				<View>
					{item.chat_with_admin && (
						<Text style={{fontSize: 10, fontFamily: 'Comfortaa-Regular'}}>
							{'Người dùng đang chat với admin'}
						</Text>
					)}
					{item.require_chat_with_admin && (
						<Text style={{fontSize: 10, fontFamily: 'Comfortaa-Regular'}}>
							{'Người dùng đang yêu cầu chat với admin'}
						</Text>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default MainChat;

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
});
