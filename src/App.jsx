import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/User/Home/Home'
import Nav from './components/User/Navbar/Nav'
import { ToastContainer, toast } from 'react-toastify';
import Footer from './components/User/Layout/Footer'
import Profile from './components/User/Profile/Profile'
import Notification from './components/User/Notification/Notification';
import SwapSkil from './components/User/Skills/SwapSkil';
import Favorate from './components/User/Favour/Favorite';
import SwapTransaction from './components/User/SwapTransaction/SwapTransaction';
import Details from './components/User/Details/Details';
import "./App.css"
import { Toaster } from 'react-hot-toast';
import Chat from './components/User/Chat/Chat';
import Assess from './components/User/Assessment/Assess';
import Group from './components/User/Group/group';
import GroupChat from './components/User/Chat/GroupChat';
import VideoCall from './components/User/VideoCall/VideoCall';

const App = () => {
  return (
   <BrowserRouter>
   <Nav />
   <ToastContainer />

    <Routes>
       <Route path ="/" element = {<Home/>}/>
        <Route path='/swapskill' element = {<SwapSkil/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/details/:skillid' element={<Details/>}/>
        <Route path='/notification' element={<Notification/> }/>
        <Route path='/favorite' element={<Favorate/>}/>
        <Route path='/swap' element={<SwapTransaction/>}/>
        <Route path='/chat/:userId' element= {<Chat/>}/>
        <Route path='/assess/:skillId/:transactionId/:requesterId' element = {<Assess/>}/>
        <Route path='/group' element={<Group/>}/>
        <Route path='/groupchat/:groupId' element={<GroupChat/>}/>
        <Route path='/videocall/:receiver/:receiverId' element={<VideoCall/>} />


     </Routes>
     <Toaster />
    <Footer/>
   </BrowserRouter>

  )
}

export default App