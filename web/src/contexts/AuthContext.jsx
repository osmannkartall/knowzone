import { useState, createContext } from 'react';

const tempUser = {
  username: 'osmannkartall',
  email: 'mail@mail.mail',
  name: 'Osman Kartal',
  bio: 'this is my bio',
  id: '6123673a32e9c02678d5e5c1',
  isLoggedIn: false,
};

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(tempUser);

  return <AuthContext.Provider value={[user, setUser]}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
