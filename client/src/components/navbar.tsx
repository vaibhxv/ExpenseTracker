import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LogOut, DollarSign } from "lucide-react";
import { Button } from '@/components/ui/button';

interface User {
  name: string;
  email: string;
}

interface NavbarProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ token, setToken }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/user`, {
          headers: { Authorization: token },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setUser(null); 
      }
    };

    if (token) {
      getUserInfo();
    } else {
      setUser(null); 
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  const getInitials = (name: string | undefined): string => {
    return name
      ?.split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <nav className="flex justify-between items-center bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 h-16">
      
      <button
       onClick={() => navigate('/')}>
      <div className="flex items-center gap-2">
        <DollarSign className="w-8 h-8 text-orange-500" />
        <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text">
          ExpenseTrackeroo
        </span>
      </div>
      </button>

     
      {user ? (
        <div className="flex items-center space-x-4">
        <Avatar className="h-8 w-8 bg-blue-600">
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-base font-medium">{user.name}</span>
          <span className="text-sm text-gray-500">{user.email}</span>
        </div>
        <div className="ml-6">
          <Button onClick={handleLogout} variant="destructive">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
      
      ) : (
        <div className='flex items-right space-x-4'>
          <Button
          onClick={() => navigate('/signup')}
          className=""
        >
          Signup
        </Button>
        <button
          onClick={() => navigate('/login')}
          className="text-orange-600 font-medium hover:text-orange-700"
        >
          Login →
        </button>
        </div>
      )}
    </nav>
  );
};
