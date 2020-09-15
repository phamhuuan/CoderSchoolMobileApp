import firestore from '@react-native-firebase/firestore';
import Table from '../constants/Table';

const getNumberOfChatPerIntent = (number, callback) => {
	return firestore()
		.collection(Table.CHAT_ANALYSIS)
		.onSnapshot((documentSnapshot) => {
			let frequency = {};
			documentSnapshot.docs.forEach((chat) => {
				const intent = chat.data().intent;
				frequency[intent] =
					frequency[intent] === undefined ? 1 : frequency[intent] + 1;
			});
			let frequencyArray = [],
				frequencyArray2 = [];
			if (number && number < documentSnapshot.size) {
				for (const key in frequency) {
					if (frequency.hasOwnProperty(key)) {
						frequencyArray.push({
							name: key,
							number: frequency[key],
						});
					}
				}
				frequencyArray.sort((a, b) => b.number - a.number);
				frequencyArray2 = frequencyArray.slice(0, number);
				let sum = 0;
				for (const intent of frequencyArray2) {
					sum += intent.number;
				}
				frequencyArray2.push({
					name: 'others',
					number: documentSnapshot.size - sum,
				});
				callback(frequencyArray2);
			} else {
				callback(frequencyArray);
			}
			console.log('getNumberOfChatPerIntent', frequencyArray);
		});
};

export default getNumberOfChatPerIntent;
