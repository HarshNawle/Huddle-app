import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth/Auth'
import Chat from './pages/chat/Chat'
import Profile from './pages/profile/Profile';
import { useAppStore } from './store/store';
import { useEffect, useState } from 'react';
import apiClient from './lib/api-client';
import { Button } from './components/ui/button';
import { Spinner } from './components/ui/spinner';
import { GET_USER_INFO } from './utils/constants';



const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
}

const App = () => {
  const {userInfo, setUserInfo} = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO,
          {withCredentials: true});
          
        if(response.status === 200 && response.data.user?._id){
          setUserInfo(response.data.user);
        } else {
          setUserInfo(undefined)
        }
      } catch (error) {
        setUserInfo(undefined);
        console.log( error );
      } finally {
        setLoading(false);
      }
    };

    if(!userInfo) {
        getUserData();
    } else{
      setLoading(false)
    }
        
  }, [userInfo, setUserInfo]);

  if(loading) {
    return <div className="flex flex-col items-center justify-center gap-4">
    <Button disabled size="sm">
      <Spinner data-icon="inline-start" />
      Loading...
    </Button>
  </div>
  }
  
  
  return (
    <Routes>
      <Route path='/auth' element={
        <AuthRoute>
          <Auth />
        </AuthRoute>
      }
      />
      <Route path='/chat' element={
        <PrivateRoute>
          <Chat />
        </PrivateRoute>
      }
      />
      <Route path='/profile' element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
        } 
      />
      <Route path='*' element={<Navigate to="/auth" />} />
    </Routes>
  )
}

export default App