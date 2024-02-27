import React from 'react';

interface UserProps {
  username: string;
}

const User: React.FC<UserProps> = ({ username }) => {
  return <h1>Welcome Back, {username}!</h1>;
};

export default User;
