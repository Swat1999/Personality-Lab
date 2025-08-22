import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../lib/api';
import Navbar from '../components/Navbar';

export default function SignUp(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirm,setConfirm] = useState('');
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert('Passwords do not match');
    try {
      const res = await api.post('/signup', { firstName, lastName, email, password });
      alert('Account created — please sign in to continue');
      router.push('/signin');
    } catch (err) {
      alert(err?.response?.data?.error || 'Sign up failed');
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className="card max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2">Create account</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="small">First Name</label>
              <input className="input" type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} required />
              </div>
              <div>
                <label className="small">Last Name</label>
                <input className="input" type="text" value={lastName} onChange={e=>setLastName(e.target.value)} required />
              </div>
              <div>
              <label className="small">Email</label>
              <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="small">Password</label>
              <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            <div>
              <label className="small">Confirm Password</label>
              <input className="input" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
            </div>
            <div className="flex items-center justify-between">
              <button className="btn" type="submit">Sign Up</button>
              <Link href="/forgot-password" legacyBehavior><a className="small">Forgot password?</a></Link>
            </div>
          </form>
          <div className="mt-3 small">Already have an account? <Link href="/signin"legacyBehavior><a className="text-sky-300">Sign in</a></Link></div>
        </div>
      </main>
    </div>
  );
}
