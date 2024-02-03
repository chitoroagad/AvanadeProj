import React from 'react';
import Link from 'next/link';

interface TabButtonProps {
  isActive: boolean;
  href: string;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, href, children }) => {
  return (
    <Link href={href}>
      <button
        style={{
          backgroundColor: isActive ? '#000' : '#F5F5F5',
          color: isActive ? '#fff' : '#000',
          borderRadius: '31px',
          padding: '18px 20px',
          cursor: 'pointer',
          outline: 'none',
          textDecoration: 'none',
          marginRight: '30px',
        }}
      >
        {children}
      </button>
    </Link>
  );
};

export default TabButton;
