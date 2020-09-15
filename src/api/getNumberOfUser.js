import firestore from '@react-native-firebase/firestore';
import Table from '../constants/Table';

const getNumberOfUser = (callback) => {
	return firestore()
		.collection(Table.USER)
		.where('role', '==', 'user')
		.onSnapshot((documentSnapshot) => {
			callback(documentSnapshot.size);
			console.log('NumberOfUser', documentSnapshot.size);
		});
};

export default getNumberOfUser;
