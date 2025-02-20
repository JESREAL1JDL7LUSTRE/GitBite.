import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import Profile from './pages/Profile.tsx';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import PreviousPayment from './pages/PreviousPayment.tsx';
import Order from './pages/Order.tsx';
import NotFound from './pages/NotFound.tsx';
import Cart from './pages/Cart.tsx';
import DesctopNavbar from './components/Navbar/DesctopNavbar.tsx';
import MobileNavbar from './components/Navbar/MobileNavbar.tsx';

const Layout = () => {
  const location = useLocation();
  
  // Define routes where the navbar should NOT be displayed
  const hideNavbarRoutes = ['*'];
  
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && (
        <>
          <DesctopNavbar />
          <MobileNavbar />
        </>
      )}
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/profile/:id' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/payment' element={<ProtectedRoute><PreviousPayment /></ProtectedRoute>} />
        <Route path='/order' element={<ProtectedRoute><Order /></ProtectedRoute>} />
        <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
);
