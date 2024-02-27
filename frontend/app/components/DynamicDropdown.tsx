"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './DynamicDropdown.module.css';

const DynamicDropdown = ({ links }: { links: { href: string, label: string, img?:string }[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const closedIcon = './maintab/dropdownClosed.png';
  const openIcon = './maintab/dropdownOpen.png';

  return (
    <div className={styles.dropdown}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.button}>
        <img src={isOpen ? openIcon : closedIcon} alt="Dropdown" />
      </button>
      {isOpen && (
        <div className={styles.dropdownContent}>
          {links.map((link, index) => (
            <Link key={index} href={link.href} passHref>
              <div className={styles.dropdownLink}>
                {link.img && <img src={link.img} alt={link.label} className={styles.linkImage} />}
                {link.label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicDropdown;
