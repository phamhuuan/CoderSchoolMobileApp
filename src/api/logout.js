import auth from '@react-native-firebase/auth';

const logout = (callback, handleError) => {
	auth()
		.signOut()
		.then(() => {
			callback();
		})
		.catch((error) => {
			handleError(error.name, error.message);
		});
};

export default logout;
