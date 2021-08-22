import React, { useState, createContext } from 'react';

const tempUser = {
  username: 'osmannkartall',
  email: 'mail@mail.mail',
  name: 'Osman Kartal',
  bio: 'This is a bio',
  id: '61211bd016d1c0389c1a0317',
  isLoggedIn: false,
};

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(tempUser);

  return <AuthContext.Provider value={[user, setUser]}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
