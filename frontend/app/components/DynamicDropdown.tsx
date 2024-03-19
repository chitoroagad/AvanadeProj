"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './DynamicDropdown.module.css';
import Image from "next/image";

const DynamicDropdown = ({ links }: { links: { href: string, label: string, img?:string }[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const closedIcon = '/maintab/dropdownClosed.png';
  const openIcon = '/maintab/dropdownOpen.png';

  return (
    <div className={styles.dropdown}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.button}>
        <Image src={isOpen ? openIcon : closedIcon} width={0} height={0} sizes="100vw" alt="Dropdown" />
      </button>
      {isOpen && (
        <div className={styles.dropdownContent}>
          {links.map((link, index) => (
            <Link key={index} href={link.href} passHref>
              <div className={styles.dropdownLink}>
                {link.img && <Image src={link.img} alt={link.label} className={styles.linkImage} />}
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
