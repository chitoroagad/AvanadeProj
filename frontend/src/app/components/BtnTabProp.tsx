"use client";
import React from 'react';
import Link from 'next/link';

interface TabButtonProps {
  isActive: boolean;
  href: string;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, href, children }) => {
  return (
    <>
      <style jsx>{`
        .tabButton {
          transition: background-color 0.3s ease;
          border-radius: 31px;
          padding: 18px 20px;
          cursor: pointer;
          outline: none;
          text-decoration: none;
          margin-right: 30px;
          border: none;
          background-color: ${isActive ? '#000' : '#F5F5F5'};
          color: ${isActive ? '#fff' : '#000'};
        }

        .tabButton:hover {
          background-color: ${isActive ? '#333' : '#E0E0E0'};
        }
      `}</style>
      <Link href={href} passHref>
        <button className="tabButton">
          {children}
        </button>
      </Link>
    </>
  );
};

export default TabButton;
