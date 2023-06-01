import React from 'react';
// import RecipeList from './components/RecipeList';
import Navbar from './components/Navbar';
// import Hero from './components/Hero';
// import ProfilePage from './components/ProfilePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Profile from './pages/Profile';
import About from './pages/About';
import Recipe from './pages/Recipe';
import Dashboard from './pages/Dashboard';
import Dashboard2 from './pages/Dashboard2';
// import Footer from './components/Footer';
import Contact from './components/Contact';
import PublishRecipe from './components/Recipe/PublishRecipe';
import Footer from './components/Footer';
import Chef from './pages/Chef';
import LogInPage from './components/LogInPage';
import DashboardChefApplications from './components/DashboardChefApplications';
import UsersDashboard from './components/UsersDashboard';

function App() {
  return (
    <Router>
      {
        //check if route is not dashboard
        !window.location.pathname.includes('/dashboard') &&
        <Navbar />
      }
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/recipe/:id" element={<Recipe />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/Login' element={<LogInPage />} />
        <Route path='/dashboard' element={<Dashboard2 />} />
        <Route path='/publishRecipe' element={<PublishRecipe />} />
        <Route path='/chef' element={<Chef />} />
        <Route path='/dashboard/chefApplications' element={<DashboardChefApplications />} />
        <Route path='/dashboard/users' element={<UsersDashboard />} />
      </Routes>
      {
        //check if route is not dashboard
        !window.location.pathname.includes('/dashboard') &&
        <Footer />
      }
    </Router>
  );
}

export default App;
