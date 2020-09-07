import React from 'react';
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	Alert,
} from 'react-native';
import {normalize} from '../../../utils/Utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import {APP_KEY} from '../../../constants/Constants';
import Colors from '../../../constants/Colors';
import logout from '../../../api/logout';

const Setting = ({navigation}) => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.iconView}
					onPress={() => {
						navigation.goBack();
					}}>
					<Ionicons
						name={'arrow-back'}
						size={normalize(36)}
						color={Colors.color_006}
					/>
				</TouchableOpacity>
				<Text style={styles.title}>Devil Ducks</Text>
			</View>
			<View>
				<TouchableOpacity
					style={styles.choice}
					onPress={() => {
						logout(
							() => {
								AsyncStorage.removeItem(APP_KEY.USER_PROFILE);
								navigation.popToTop();
							},
							(name, message) => {
								Alert.alert(name, message);
							},
						);
					}}>
					<Text style={styles.choiceText}>Đăng xuất</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {flex: 1},
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
	},
	iconView: {
		width: normalize(40),
		height: normalize(60),
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: normalize(10),
	},
	choice: {
		height: normalize(60),
		justifyContent: 'center',
		paddingHorizontal: normalize(18),
		borderBottomWidth: 1,
		backgroundColor: Colors.color_006,
	},
	choiceText: {
		fontSize: 18,
	},
});

export default Setting;
