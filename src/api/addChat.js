import firestore from '@react-native-firebase/firestore';

const addChat = (user_id, data) => {
	firestore()
		.collection('CHAT')
		.doc(user_id)
		.collection('CHAT_LIST')
		.add(data)
		.then((querySnapshot) => {})
		.catch((error) => {
			console.warn(error);
		});
};

export default addChat;
