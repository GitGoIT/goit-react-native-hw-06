import { auth } from "../../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { authSlice } from "./authReducer";

const { updateUserProfile, authStateChange, authSignOut } = authSlice.actions;


export const authSignUpUser = ({email, password, login, photo}) => async (dispatch, getState) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);

        const user = await auth.currentUser;
        console.log(user);
        const { displayName, uid, photoURL } = await auth.currentUser;
        console.log(photoURL);

        await updateProfile(user, {
            displayName: login,
            photoURL: photo,
        });
        
        const userUpdateProfile = {
                userid: uid,
                login: displayName,
                userId: uid,
                email: email,
                photo: photoURL,   
            };

        dispatch(updateUserProfile(userUpdateProfile));
        
    } catch (error) {
        console.log('error', error);
        console.log('error.message', error.message);
    }
};
export const authSignInUser = ({email, password}) => async (dispatch, getState) => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        console.log('user', user)
    } catch (error) {
        console.log('error', error);
        console.log('error.message', error.message);
    }
};
export const authSignOutUser = () => async (dispatch, getState) => {
    try {
    await auth.signOut();
    dispatch(authSignOut());
  } catch (error) {
    console.log(error.message);
  }
 };

export const authStateChangeUser = () => async (dispatch, getState) => {
    await onAuthStateChanged(auth, (user) => {
        if (user) {
            const userUpdateProfile = {
                userId: user.uid,
                login: user.displayName,
                email: user.email,
                photo: user.photoURL,
            };
            dispatch(updateUserProfile(userUpdateProfile));
            dispatch(authStateChange({stateChange: true}));  
        }
    });
 };