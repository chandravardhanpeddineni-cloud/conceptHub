import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import './index.css'
import { Auth, Home, Navbar, Logout, Settings, CreateArticle, Article, } from "./pages";
import Profile from "./pages/Profile";
import Test from "./pages/Test";
import UserProfile from "./pages/UserProfile";
import Chat from "./pages/Chat";


const App = () => {

  return (
    <Router>
      <div>
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md"><Navbar /></header>
          <main className="mt-16 p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/create" element={<CreateArticle />} />
              <Route path="/article/:slug" element={<Article />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/@:username" element={<Profile />} />
              <Route path='/user/:id' element={<UserProfile/>}/>
              <Route path='/chat/:id' element={<Chat/>}/>
              <Route path="*" element={<h1>404 not found</h1>} />
            </Routes>
          </main>
      </div>
    </Router>
  );
};

export default App;
