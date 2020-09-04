import React from 'react';
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
} from 'react-native';
import {normalize} from '../../../utils/Utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import {APP_KEY} from '../../../constants/Constants';

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
						color={'#f6f5d7'}
					/>
				</TouchableOpacity>
				<Text style={styles.title}>Devil Ducks</Text>
			</View>
			<View>
				<TouchableOpacity
					style={styles.choice}
					onPress={() => {
						AsyncStorage.removeItem(APP_KEY.USER_PROFILE);
						navigation.popToTop();
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
	choice: {
		height: normalize(60),
		justifyContent: 'center',
		paddingHorizontal: normalize(18),
		borderBottomWidth: 1,
		backgroundColor: '#f6f5d7',
	},
	choiceText: {
		fontSize: 18,
	},
});

export default Setting;
