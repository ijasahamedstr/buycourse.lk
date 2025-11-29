import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from "./Page/Footer"
import Header from "./Page/header"
import Home from "./Page/Home"
import Topbar from "./Page/Topbar"
import TamilCourses from './Page/tamil-courses';
import SinhalaCourses from './Page/sinhala-courses';
import EnglishCourses from './Page/English-courses';
import PremiumAccountService from './Page/PremiumAccountService';
import CoursePage from './Page/Couresview';
import AllAccountsWithCategory from './Page/premium-account-category';

function App() {

  return (
    <>
      <Router>
      <Topbar />
      <Header/>     
      <Routes>
        <Route path="/" element={< Home/>} />
        <Route path="/tamil-courses" element={<TamilCourses/>} />
        <Route path="/sinhala-courses" element={<SinhalaCourses/>} />
        <Route path="/english-courses" element={<EnglishCourses/>} />
        <Route path="/premium-account-service" element={<PremiumAccountService/>} />
        <Route path="/course/:slug" element={<CoursePage />} />
        <Route path="/category/:slug" element={<AllAccountsWithCategory/>} />
        {/* Add routes for settings if needed */}
      </Routes>
      <Footer/>
    </Router>
     
    </>
  )
}

export default App
