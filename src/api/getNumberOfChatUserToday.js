import firestore from '@react-native-firebase/firestore';
import Table from '../constants/Table';

const getNumberOfUserChatToday = (callback) => {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const date = now.getDate();
	const firstMillisecond = new Date(`${month}/${date}/${year}`).getTime();
	const lastMillisecond =
		new Date(`${month}/${date}/${year}`).getTime() + 24 * 60 * 60 * 1000;
	return firestore()
		.collection(Table.CHAT_ANALYSIS)
		.where('user_created_at', '>=', firstMillisecond)
		.where('user_created_at', '<', lastMillisecond)
		.onSnapshot((documentSnapshot) => {
			documentSnapshot = documentSnapshot.docs.map((x) => x.data());
			documentSnapshot = documentSnapshot.filter(
				(a, index) =>
					index === documentSnapshot.findIndex((b) => b.user_id === a.user_id),
			);
			callback(documentSnapshot.length);
			console.log('getNumberOfUserChatToday', documentSnapshot.length);
		});
};

export default getNumberOfUserChatToday;
