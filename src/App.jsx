import React from 'react';

import { Route,
  RouterProvider, 
  createBrowserRouter, 
  createRoutesFromElements }
  from 'react-router-dom';


import Registration from './pages/Registration';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ForgotPassword from './pages/forgotPassword/ForgotPassword';

import Root from './pages/root/Root';

import DashBorad from './pages/DashBoard/DashBorad';
import Message from './pages/Message/Message';
import Alert from './pages/Aleart/Alert';


const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route >
        <Route path="/" element={<Registration/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/forgotpassword" element={<ForgotPassword/>}></Route>
        <Route path="/home" element={<Root/>}>
          <Route path="/home" element={ <DashBorad/>}></Route>
          <Route path="Message" element={ <Message/>}></Route>
          <Route path="Alert" element={ <Alert/>}></Route>
        </Route>

     </Route>)
);  

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
   
  );
};

export default App;