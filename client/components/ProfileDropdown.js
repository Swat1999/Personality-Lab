import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ProfileDropdown(){
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      router.push('/');
    }
  };
  if (!mounted) return null;
  return (
    <div className="relative">
      <button onClick={()=>setOpen(!open)} className="p-1 rounded-full bg-white/5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-sky-400 text-black flex items-center justify-center">U</div>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white/5 p-3 rounded-md w-44">
          <Link href="/profile" legacyBehavior><a className="block py-1">Profile</a></Link>
          <Link href="/settings" legacyBehavior><a className="block py-1">Settings</a></Link>
          <Link href="/manage" legacyBehavior><a className="block py-1">Manage</a></Link>
          <button onClick={logout} className="btn w-full mt-2">Logout</button>
        </div>
      )}
    </div>
  );
}
