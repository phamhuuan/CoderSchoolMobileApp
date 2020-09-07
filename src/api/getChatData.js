import firestore from '@react-native-firebase/firestore';
import Table from '../constants/Table';

const getChatData = (
	user_id,
	start_after,
	limit,
	hasDataCallback,
	noDataCallback,
	handleError,
) => {
	firestore()
		.collection(Table.CHAT)
		.doc(user_id)
		.collection(Table.CHAT_LIST)
		.get()
		.then((documentSnapshot) => {
			console.log(documentSnapshot.size);
			if (documentSnapshot.size > 0) {
				firestore()
					.collection(Table.CHAT)
					.doc(user_id)
					.collection(Table.CHAT_LIST)
					.orderBy('createdAt', 'desc')
					.startAfter(start_after)
					.limit(limit)
					.get()
					.then((querySnapshot) => {
						console.log(
							'data',
							querySnapshot.docs.map((x) => x.data()),
						);
						hasDataCallback(
							querySnapshot.docs.map((x) => x.data()),
							documentSnapshot.size,
						);
					})
					.catch((error) => {
						handleError(error.name, error.message);
						console.log('error', error);
					});
			} else {
				noDataCallback();
				console.log('no chat data');
			}
		});
	return [];
};

export default getChatData;
