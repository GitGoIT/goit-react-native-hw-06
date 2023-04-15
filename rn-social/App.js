import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from "react-redux";
import { store } from "./redux/store"
import Main from "./components/Main";

export default function App() {
  
  return (
    <Provider store ={store}>
      <Main/>
    </Provider>
  );
}
