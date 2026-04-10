import { useEffect, useState } from 'react'
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/User-login';
import Signup from './pages/User-signup';
import AuthorityLogin from './pages/AuthorityLogin';
import AuthoritySignup from './pages/AuthoritySignup';
import UserDashboard from './pages/UserDashboard';
import ComplaintForm from './pages/ComplaintForm';
import AuthorityDashboard from './pages/AuthorityDashboard';
import EventsPage from './pages/EventsPage'; 

function App() {
  const [user, setUser] = useState(null);

  // Load user on first start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);
 
  return (
    <>
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} setUser={setUser} />
      
      <main className="max-w-7xl mx-auto py-10 px-4">
        <Routes>
          <Route path="/" element={<ComplaintForm user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/authority-login" element={<AuthorityLogin setUser={setUser} />} />
          <Route path="/authority-signup" element={<AuthoritySignup />} />
         <Route path="/authority" element={<AuthorityDashboard user={user} setUser={setUser} />} />
          <Route path="/dashboard" element={<UserDashboard user={user} />} />
          <Route path="/report-issue" element={<ComplaintForm user={user} />} />
          <Route path="/events" element={<EventsPage user={user} />} />
        </Routes>
      </main>
    </div>
    </>
  )
}

export default App;