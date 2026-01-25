'use client';

import Link from 'next/link';
import { useState } from 'react';
import TopBar from './TopBar';
import NavBar from './NavBar';

export default function Header() {
  const [activeLink, setActiveLink] = useState('home');

  return (
    <header>
      <TopBar />
      <NavBar activeLink={activeLink} setActiveLink={setActiveLink} />
    </header>
  );
}