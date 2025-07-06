import React from 'react';
import UserLayout from './UserLayout';

interface UserPageWrapperProps {
  children: React.ReactNode;
  title?: string;
}

const UserPageWrapper: React.FC<UserPageWrapperProps> = ({ children, title }) => {
  return (
    <UserLayout title={title}>
      {children}
    </UserLayout>
  );
};

export default UserPageWrapper; 