import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';

const register = (email, password, callback, handleError) => {
	auth()
		.createUserWithEmailAndPassword(email, password)
		.then(({user}) => {
			console.log(user);
			if (!user.emailVerified) {
				user.sendEmailVerification().then(() => {
					Alert.alert(`Đã gửi email xác thực đến ${email}`);
				});
			}
			callback(user);
		})
		.catch((error) => {
			handleError(error.name, error.message);
		});
};

export default register;
