import firestore from '@react-native-firebase/firestore';
import Table from '../constants/Table';

const addUser = (userInfo, callback, handleError) => {
	firestore()
		.collection(Table.USER)
		.doc(userInfo.user_id)
		.set(userInfo)
		.then(() => {
			console.log('User added!');
			callback();
		})
		.catch((error) => {
			handleError(error.name, error.message);
		});
};

export default addUser;
