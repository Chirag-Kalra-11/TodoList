import './App.css';
import { useEffect, useReducer, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Active from './components/Active';
import Completed from './components/Completed';
import AllTask from './components/AllTask';
import Layout from './components/Layout';
import TaskContext from './context/TaskContext';
import TokenContext from './context/TokenContext';
import taskReducer from './reducer/taskReducer';
import tokenReducer from './reducer/tokenReducer';
import userReducer from './reducer/userReducer';
import Header from './components/Header/Header';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/forgotPassword/ForgotPassword';
import ResetPassword from './components/forgotPassword/ResetPassword';
import axios from './Axios/axios.js';
function App() {
  const token = JSON.parse(localStorage.getItem("authToken"));
  const [tasks, dispatch] = useReducer(taskReducer, [])
  const [userToken, tokenDispatch] = useReducer(tokenReducer, token)
  const [user, userDispatch] = useReducer(userReducer, {})
  const [layoutState, setlayoutState] = useState(1)
  useEffect(() => {
    console.log("App.js");
    const fetchUser = async () => {
      try {
        console.log("fetchUser");
        const res = await axios.get("/user/getUser", {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
        //tokenDispatch({type: "SET_TOKEN", payload: res.token})
        console.log("res.data: ", res.data);
        userDispatch({ type: "SET_USER", payload: res.data.user })
      } catch (error) {
        console.log(error);
      }
    }
    if (userToken) {
      fetchUser()
    }
  }, [userToken])
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log("fetchTasks");
        const res = await axios.get("/task/getTask", {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
        dispatch({ type: "SET_TASK", payload: res.data })
      } catch (error) {
        console.log(error);
      }
    }
    if (userToken) {
      fetchTasks()
    }
  }, [userToken,layoutState])

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [editorId, setEditorId] = useState("")

  // useEffect(() => {

  
  //   return () => {
      
  //   }
  // }, [layoutState])
  

  return (
    <BrowserRouter>
      <TokenContext.Provider value={{ userToken, tokenDispatch, user, userDispatch }}>
        <TaskContext.Provider value={{ tasks, dispatch }}>
          <Routes>
            <Route path="/" element={<Header />}>
              <Route path='/' element={token ? <Layout title={title} setTitle={setTitle} description={description} setDescription={setDescription} layoutState={layoutState} setlayoutState={setlayoutState} editorId={editorId}  /> : <Login />}>
                <Route index element={<AllTask title={title} setTitle={setTitle} description={description} setDescription={setDescription} layoutState={layoutState} setlayoutState={setlayoutState} setEditorId={setEditorId} />} />
                <Route path="active" element={<Active title={title} setTitle={setTitle} description={description} setDescription={setDescription} layoutState={layoutState} setlayoutState={setlayoutState} setEditorId={setEditorId} />} />
                <Route path="completed" element={<Completed />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
            </Route>
          </Routes>
        </TaskContext.Provider>
      </TokenContext.Provider>

    </BrowserRouter>
  );
}

export default App;
