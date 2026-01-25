'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BiSearch, BiCalendarEvent} from 'react-icons/bi';

export default function TopBar() {
  return (
    <div className="bg-white rounded-[50px] shadow-lg py-3 px-8 flex items-center justify-between max-w-7xl mx-auto mt-6">
      <Link href="/">
        <div className="h-18 relative overflow-hidden animate-[slideReveal_1s_ease-out_forwards] scale-[1.4] origin-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={70}
            className="h-full w-auto"
          />
        </div>
      </Link>

      <form className="search-box flex items-center border border-gray-300 rounded-full overflow-hidden w-[420px] bg-white">
        <span className="px-3 text-gray-500"><BiSearch /></span>
        <input
          type="text"
          name="q"
          placeholder="Search event or category"
          className="border-none flex-1 py-2 px-3 text-sm outline-none"
        />
        <Link
          href="/calendar"
          className="calendar-btn flex items-center justify-center px-3 text-gray-500 hover:text-[#F59E0B] transition-all"
          title="View Calendar"
        >
          <BiCalendarEvent />
        </Link>
      </form>

      <div className="flex items-center gap-4">
        <Link href="/account" className="text-gray-800 font-semibold flex items-center">
          <BiCalendarEvent className="mr-1" /> My Account
        </Link>
        <button className="btn-signup bg-[#E49E00] text-white border-none py-2 px-5 rounded-full font-semibold hover:opacity-85 transition">
          Sign Up
        </button>
        <Link href="/cart" className="text-gray-800 relative">
          <BiCalendarEvent className="text-xl" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            2
          </span>
        </Link>
        <div className="dropdown relative">
          <button className="dropdown-toggle text-gray-800 flex items-center">
            <img
              src="https://flagcdn.com/gb.svg"
              alt="EN"
              className="lang-flag w-5 h-auto rounded me-1"
            /> EN
          </button>
          <div className="dropdown-menu absolute right-0 mt-2 bg-white shadow-lg rounded-lg hidden">
            <a href="#" className="dropdown-item flex items-center px-4 py-2 hover:bg-gray-100">
              <img src="https://flagcdn.com/gb.svg" className="lang-flag w-5 me-2" /> English
            </a>
            <a href="#" className="dropdown-item flex items-center px-4 py-2 hover:bg-gray-100">
              <img src="https://flagcdn.com/fr.svg" className="lang-flag w-5 me-2" /> Français
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideReveal {
          0% {
            clip-path: inset(0 100% 0 0);
            opacity: 0;
            transform: translateX(-20px) scale(1.4);
          }
          100% {
            clip-path: inset(0 0 0 0);
            opacity: 1;
            transform: translateX(0) scale(1.4);
          }
        }
        .lang-flag {
          width: 20px;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}