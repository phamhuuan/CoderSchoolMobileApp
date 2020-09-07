import firestore from '@react-native-firebase/firestore';
import Table from '../constants/Table';

const getUserInfo = (user_id, callback, handleError) => {
	firestore()
		.collection(Table.USER)
		.doc(user_id)
		.get()
		.then((querySnapShot) => {
			console.log('data', querySnapShot.data());
			callback(querySnapShot.data());
		})
		.catch((error) => {
			handleError(error.name, error.message);
		});
};

export default getUserInfo;
