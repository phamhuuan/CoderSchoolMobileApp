import firestore from '@react-native-firebase/firestore';
import Table from '../constants/Table';

const getNumberOfChat = (callback) => {
	return firestore()
		.collection(Table.CHAT_ANALYSIS)
		.onSnapshot((documentSnapshot) => {
			callback(documentSnapshot);
			console.log('getNumberOfChat', documentSnapshot.size);
		});
};

export default getNumberOfChat;
