import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from "../../api/api";
import { ACCESS_TOKEN, REFRECH_TOKEN } from '@/api/constant';
import { UserCircle } from 'lucide-react';
import SignOut from './SignOut';
import NavbarMenu from '../Navbar/NavbarMenu';
import { Button } from '../ui/button';

const refreshToken = async () => {
  const refreshToken = localStorage.getItem(REFRECH_TOKEN);
  try {
    const res = await api.post('/api/token/refresh/', { refresh: refreshToken });
    if (res.status === 200) {
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
  return false;
};

const isLoggedIn = async () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (!tokenExpiration || tokenExpiration < now) {
      const refreshed = await refreshToken();
      if (!refreshed) return false;
    }

    return true;
  } catch (error) {
    console.error('Token validation error', error);
    return false;
  }
};

function IsSignInOrNot() {
  const [isLoggedInState, setIsLoggedInState] = useState<boolean | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedInStatus = await isLoggedIn();
      setIsLoggedInState(loggedInStatus);
    };

    checkLoginStatus();
  }, []);

  if (isLoggedInState === null) {
    return <div>Loading...</div>; 
  }

  return isLoggedInState ? (
    <div style={{ position: 'relative' }}>
      <UserCircle
        size={32}
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ cursor: 'pointer' }}
      />
      {showDropdown && (
        <div className='flex flex-col p-4 gap-2'
          style={{
            position: 'absolute',
            top: '40px',
            right: '0',
            backgroundColor: 'white',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '30px',
            borderRadius: '10px',
          }}
        >
          <NavbarMenu />
          <SignOut />
        </div>
      )}
    </div>
  ) : (
    <div className='flex gap-2'>
      <Button onClick={() => nav('/signin')}>Sign In</Button>
      <Button onClick={() => nav('/signup')}>Sign Up</Button>
    </div>
  );
}

export default IsSignInOrNot;
