import { useState } from 'react';
import { signIn } from '../Firebase/auth_signin';

export const useLogin = () => {
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setError(null);
      const user = await signIn(email, password);
      console.log("User logged in:", user);
    } catch (err) {
      setError(err.message);
    }
  };

  return { error, login };
};
