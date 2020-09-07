import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';

const login = (email, password, callback, handleError) => {
	console.warn(email, password, callback, handleError);
	auth()
		.signInWithEmailAndPassword(email, password)
		.then(({user}) => {
			console.log(user);
			if (!user.emailVerified) {
				Alert.alert(
					'',
					`Tài khoản chưa được xác thực, hãy vào ${user.email} để xác thực tài khoản`,
				);
			} else {
				callback(user);
			}
		})
		.catch((error) => {
			handleError(error.name, error.message);
		});
};

export default login;
