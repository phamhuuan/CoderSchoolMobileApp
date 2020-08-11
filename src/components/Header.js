import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {normalize} from '../utils/Utils';

export default function Header({
	leftIcon,
	rightIcon,
	title,
	onPressLeftIcon,
	onPressRightIcon,
}) {
	return (
		<View style={styles.header}>
			<TouchableOpacity
				disabled={!leftIcon}
				style={styles.iconContainer}
				onPress={onPressLeftIcon}>
				{!!leftIcon && <Image source={leftIcon} style={styles.icon} />}
			</TouchableOpacity>
			<Text style={styles.headerTitle}>{title}</Text>
			<TouchableOpacity
				disabled={!rightIcon}
				style={styles.iconContainer}
				onPress={onPressRightIcon}>
				{!!rightIcon && <Image source={rightIcon} style={styles.icon} />}
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {flex: 1},
	header: {
		height: normalize(60),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	icon: {height: normalize(24), width: normalize(24)},
	iconContainer: {
		width: normalize(40),
		height: normalize(40),
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerTitle: {fontSize: normalize(20)},
});
