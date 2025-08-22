import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../lib/api';
import Navbar from '../components/Navbar';

export default function SignIn(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/signin', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err) {
      alert(err?.response?.data?.error || 'Sign in failed');
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className="card max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="small">Email</label>
              <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="small">Password</label>
              <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            <div className="flex items-center justify-between">
              <button className="btn" type="submit">Sign In</button>
              <Link href="/forgot-password" legacyBehavior><a className="small">Forgot password?</a></Link>
            </div>
          </form>
          <div className="mt-3 small">Don't have an account? <Link href="/signup" legacyBehavior><a className="text-sky-300">Create account</a></Link></div>
        </div>
      </main>
    </div>
  );
}
