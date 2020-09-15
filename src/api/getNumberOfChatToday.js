import firestore from '@react-native-firebase/firestore';
import Table from '../constants/Table';

const getNumberOfChatToday = (number, callback) => {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const date = now.getDate();
	const lastMillisecond =
		new Date(`${month}/${date}/${year}`).getTime() + 24 * 60 * 60 * 1000;
	const firstMillisecond = lastMillisecond - number * 24 * 60 * 60 * 1000;
	return firestore()
		.collection(Table.CHAT_ANALYSIS)
		.where('user_created_at', '>=', firstMillisecond)
		.where('user_created_at', '<', lastMillisecond)
		.orderBy('user_created_at', 'asc')
		.onSnapshot((documentSnapshot) => {
			callback(documentSnapshot, firstMillisecond, lastMillisecond);
			console.log('getNumberOfChatToday', documentSnapshot.size);
		});
};

export default getNumberOfChatToday;
