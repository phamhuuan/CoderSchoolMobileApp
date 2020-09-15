import firestore from '@react-native-firebase/firestore';
import Table from '../constants/Table';

const getChatData = (
	user_id,
	start_after,
	limit,
	hasDataCallback,
	noDataCallback,
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
					.onSnapshot((documentSnapshot2) => {
						console.log(
							'data',
							documentSnapshot2.docs.map((x) => x.data()),
						);
						hasDataCallback(
							documentSnapshot2.docs.map((x) => x.data()),
							documentSnapshot.size,
						);
					});
			} else {
				noDataCallback();
				console.log('no chat data');
			}
		});
};

export default getChatData;
