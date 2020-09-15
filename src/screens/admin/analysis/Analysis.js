/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useMemo} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	Image,
	BackHandler,
	ScrollView,
	Dimensions,
} from 'react-native';
import {normalize} from '../../../utils/Utils';
import Colors from '../../../constants/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {PieChart, BarChart} from 'react-native-chart-kit';
import ScreenName from '../../../constants/ScreenName';
import getNumberOfUser from '../../../api/getNumberOfUser';
import getNumberOfUserChatToday from '../../../api/getNumberOfChatUserToday';
import getNumberOfChat from '../../../api/getNumberOfChat';
import getNumberOfChatToday from '../../../api/getNumberOfChatToday';
import getNumberOfChatPerIntent from '../../../api/getNumberOfChatPerIntent';
import firestore from '@react-native-firebase/firestore';
import Table from '../../../constants/Table';

const parseDay = (num) => {
	switch (num) {
		case 0:
			return 'CN';
		case 1:
			return 'T2';
		case 2:
			return 'T3';
		case 3:
			return 'T4';
		case 4:
			return 'T5';
		case 5:
			return 'T6';
		case 6:
			return 'T7';
		default:
			break;
	}
};

const Analysis = ({navigation}) => {
	const [numUser, setNumUser] = useState(0);
	const [numUserChatToday, setNumUserChatToday] = useState(0);
	const [numChat, setNumChat] = useState(0);
	const [numChatToday, setNumChatToday] = useState(0);
	const [numMessage, setNumMessage] = useState(0);
	const [dataNumChatPerIntent, setDataNumChatPerIntent] = useState([]);
	const [dataNumChatPerDay, setDataNumChatPerDay] = useState({});
	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				BackHandler.exitApp();
				return true;
			},
		);
		return () => {
			backHandler.remove();
		};
	}, []);

	useEffect(() => {
		firestore()
			.collection(Table.CHAT)
			.where('require_chat_with_admin', '==', true)
			.onSnapshot((x) => {
				setNumMessage(x.size);
			});
		getNumberOfUser((x) => {
			setNumUser(x);
		});
		getNumberOfUserChatToday((x) => {
			setNumUserChatToday(x);
		});
		getNumberOfChat((x) => {
			setNumChat(x.size);
		});
		getNumberOfChatToday(1, (x, y, z) => {
			setNumChatToday(x.size);
		});
		getNumberOfChatPerIntent(4, (x) => {
			x = x.map((y) => {
				const red = Math.round(Math.random() * 200 + 55);
				const green = Math.round(Math.random() * 200 + 55);
				const blue = Math.round(Math.random() * 200 + 55);
				return {
					...y,
					color: `rgb(${red}, ${green}, ${blue})`,
				};
			});
			setDataNumChatPerIntent(x);
		});
		getNumberOfChatToday(7, (x, y, z) => {
			let num = 0,
				data = [],
				labels = [],
				i = 1;
			for (let j = 0; j < x.size; j++) {
				if (x.docs[j].data().user_created_at < y + i * 24 * 60 * 60 * 1000) {
					num++;
				} else {
					labels.push(
						parseDay(new Date(y + (i - 1) * 24 * 60 * 60 * 1000).getDay()),
					);
					data.push(num);
					num = 0;
					i++;
					j--;
				}
			}
			data.push(num);
			labels.push(
				parseDay(new Date(y + (i - 1) * 24 * 60 * 60 * 1000).getDay()),
			);
			setDataNumChatPerDay({labels, datasets: [{data}]});
		});
	}, []);
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
					<Pressable
						style={styles.iconView}
						onPress={() => {
							navigation.navigate(ScreenName.Screen_Admin_Main_Chat_screen);
						}}>
						<AntDesign
							name={'message1'}
							size={24}
							style={styles.icon}
							color={Colors.color_006}
						/>
						<View
							style={{
								padding: 5,
								minWidth: 20,
								height: 20,
								borderRadius: 50,
								backgroundColor: Colors.color_015,
								justifyContent: 'center',
								alignItems: 'center',
								position: 'absolute',
								right: -3,
								top: 8,
							}}>
							<Text style={{fontSize: 10, color: Colors.color_007}}>
								{numMessage}
							</Text>
						</View>
					</Pressable>
					<Pressable
						style={styles.iconView}
						onPress={() => {
							navigation.navigate(ScreenName.Screen_Admin_Setting_screen);
						}}>
						<Entypo
							name={'dots-three-vertical'}
							size={24}
							style={styles.icon}
							color={Colors.color_006}
						/>
					</Pressable>
				</View>
			</View>
		),
		[navigation, numMessage],
	);
	const chartConfig2 = {
		backgroundGradientFrom: Colors.color_007,
		backgroundGradientFromOpacity: 0,
		backgroundGradientTo: Colors.color_007,
		backgroundGradientToOpacity: 0.5,
		color: (opacity = 1) => Colors.color_014,
		strokeWidth: 2, // optional, default 3
		barPercentage: 0.5,
		useShadowColorFromDataset: false, // optional
	};
	return (
		<View style={styles.container}>
			{header}
			<ScrollView style={{marginTop: normalize(60)}}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
					}}>
					<View
						style={[
							styles.view1,
							{backgroundColor: Colors.color_010, borderTopLeftRadius: 16},
						]}>
						<Text style={styles.countNumber}>{numUser}</Text>
						<Text
							style={{
								color: Colors.color_007,
								fontSize: normalize(20),
								fontFamily: 'Comfortaa-Regular',
							}}>
							{'Người dùng'}
						</Text>
					</View>
					<View
						style={[
							styles.view1,
							{backgroundColor: Colors.color_011, borderTopRightRadius: 16},
						]}>
						<Text style={styles.countNumber}>{numUserChatToday}</Text>
						<Text
							style={{
								color: Colors.color_007,
								fontSize: normalize(12),
								fontFamily: 'Comfortaa-Regular',
							}}>
							{'Người dùng đã chat hôm nay'}
						</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
					}}>
					<View
						style={[
							styles.view1,
							{backgroundColor: Colors.color_012, borderBottomLeftRadius: 16},
						]}>
						<Text style={styles.countNumber}>{numChat}</Text>
						<Text
							style={{
								color: Colors.color_007,
								fontSize: normalize(20),
								fontFamily: 'Comfortaa-Regular',
							}}>
							{'Tin nhắn'}
						</Text>
					</View>
					<View
						style={[
							styles.view1,
							{backgroundColor: Colors.color_013, borderBottomRightRadius: 16},
						]}>
						<Text style={styles.countNumber}>{numChatToday}</Text>
						<Text
							style={{
								color: Colors.color_007,
								fontSize: normalize(14),
								fontFamily: 'Comfortaa-Regular',
							}}>
							{'Tin nhắn trong hôm nay'}
						</Text>
					</View>
				</View>
				<Pressable
					onPress={() => {}}
					style={{
						marginHorizontal: normalize(24),
						marginTop: normalize(16),
						flexDirection: 'row',
						alignItems: 'center',
					}}>
					<Text
						style={{
							color: Colors.color_005,
							fontSize: 18,
							fontFamily: 'Comfortaa-Regular',
						}}>
						Thông kê tin nhắn theo intent
					</Text>
					<View style={{flex: 1}} />
					<AntDesign name={'right'} size={18} color={Colors.color_005} />
				</Pressable>
				{dataNumChatPerIntent.length > 0 && (
					<View>
						<PieChart
							data={dataNumChatPerIntent}
							width={Dimensions.get('window').width}
							height={Dimensions.get('window').width}
							chartConfig={{
								color: (color) => color,
							}}
							hasLegend={false}
							accessor="number"
							backgroundColor="transparent"
							absolute
							center={[Dimensions.get('window').width / 4, 0]}
						/>
						{dataNumChatPerIntent.map((x, index) => {
							return (
								<View
									key={index}
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										marginTop: normalize(5),
										alignSelf: 'center',
									}}>
									<View
										style={{
											height: normalize(25),
											minWidth: normalize(25),
											paddingHorizontal: normalize(5),
											borderRadius: 50,
											backgroundColor: x.color,
											justifyContent: 'center',
											alignItems: 'center',
										}}>
										<Text style={{color: Colors.color_007}}>{x.number}</Text>
									</View>
									<Text
										style={{
											color: x.color,
											marginLeft: normalize(16),
											fontSize: normalize(20),
											fontFamily: 'Comfortaa-Regular',
										}}>
										{x.name}
									</Text>
								</View>
							);
						})}
					</View>
				)}
				<Pressable
					onPress={() => {}}
					style={{
						marginHorizontal: normalize(24),
						marginTop: normalize(16),
						flexDirection: 'row',
						alignItems: 'center',
					}}>
					<Text
						style={{
							color: Colors.color_005,
							fontSize: 18,
							fontFamily: 'Comfortaa-Regular',
						}}>
						Thông kê tin nhắn theo ngày
					</Text>
					<View style={{flex: 1}} />
					<AntDesign name={'right'} size={18} color={Colors.color_005} />
				</Pressable>
				{JSON.stringify(dataNumChatPerDay) !== '{}' && (
					<BarChart
						data={dataNumChatPerDay}
						width={Dimensions.get('window').width - 10}
						height={300}
						yAxisLabel=""
						chartConfig={chartConfig2}
						verticalLabelRotation={30}
						fromZero
					/>
				)}
			</ScrollView>
		</View>
	);
};

export default Analysis;

const styles = StyleSheet.create({
	container: {flex: 1, backgroundColor: Colors.color_007},
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
	view1: {
		width: '45%',
		height: normalize(80),
		justifyContent: 'center',
		alignItems: 'center',
		margin: normalize(4),
	},
	countNumber: {
		color: Colors.color_007,
		fontSize: normalize(30),
		fontFamily: 'Comfortaa-Regular',
	},
});
