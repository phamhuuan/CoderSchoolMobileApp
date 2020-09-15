import firestore from '@react-native-firebase/firestore';
import Table from '../constants/Table';

const getChatWith = (user_id, callback) => {
	firestore()
		.collection(Table.CHAT)
		.doc(user_id)
		.onSnapshot((documentSnapshot) => {
			callback(documentSnapshot.data());
			console.log('documentSnapshot 123', documentSnapshot.data());
		});
};

export default getChatWith;
