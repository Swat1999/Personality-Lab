import Link from 'next/link';
import ProfileDropdown from './ProfileDropdown';
import { useState, useEffect } from 'react';

export default function Navbar(){
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);
  return (
    <nav className="bg-white/2 p-4">
      <div className="container flex justify-between items-center">
        <div className="text-2xl font-bold text-purple-300">PersonalityLab</div>
        <div className="flex items-center gap-3">
          <Link href="/" legacyBehavior><a className="small">Home</a></Link>
          {token ? <ProfileDropdown/> : <Link href="/signin">Sign In</Link>}
        </div>
      </div>
    </nav>
  );
}
