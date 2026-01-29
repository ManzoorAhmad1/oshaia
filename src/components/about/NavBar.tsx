'use client';

import Link from 'next/link';
import { BiHome } from 'react-icons/bi';

interface NavBarProps {
  activeLink: string;
  setActiveLink: (link: string) => void;
}

export default function NavBar({ activeLink, setActiveLink }: NavBarProps) {
  const links = [
    { id: 'home', label: 'Home', href: '/', icon: <BiHome /> },
    { id: 'events', label: 'Events', href: '/events' },
    { id: 'about', label: 'About Us', href: '/about' },
    { id: 'help', label: 'Help Center', href: '/help' },
  ];

  return (
    <nav className="navbar-hi bg-transparent mt-[-10px] pl-32">
      <div className="nav-container bg-[rgba(15,23,42,0.7)] backdrop-blur-md inline-flex items-center justify-start gap-8 py-2 px-10 rounded-full shadow-lg">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={`nav-link relative text-white uppercase font-extrabold text-sm tracking-wide no-underline flex items-center gap-1 py-2 px-3 border-b-3 border-transparent ${
              activeLink === link.id ? 'text-[#c89c6b] border-[#c89c6b]' : ''
            } hover:text-[#c89c6b] hover:border-[#c89c6b] transition-colors`}
            onClick={() => setActiveLink(link.id)}
          >
            {link.icon && <span>{link.icon}</span>}
            {link.label}
            {link.id !== 'help' && (
              <span className="absolute right-[-0.75rem] top-1/2 transform -translate-y-1/2 w-px h-3.5 bg-white/30"></span>
            )}
          </Link>
        ))}
      </div>

      <style jsx>{`
        .nav-link {
          font-weight: 800 !important;
        }
      `}</style>
    </nav>
  );
}