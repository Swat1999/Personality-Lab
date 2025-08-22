import { useState } from 'react';
import api from '../lib/api';
import Navbar from '../components/Navbar';

export default function ForgotPassword(){
  const [email,setEmail] = useState('');
  const [newPassword,setNewPassword] = useState('');
  const [step,setStep] = useState(1);

  const requestReset = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      setStep(2);
      alert('Email found. For this demo enter new password to reset.');
    } catch (err) {
      alert(err?.response?.data?.error || 'Error');
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/reset-password', { email, newPassword });
      alert('Password updated. Sign in with new password.');
    } catch (err) {
      alert(err?.response?.data?.error || 'Error');
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className="card max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2">Forgot password</h2>
          {step === 1 ? (
            <form onSubmit={requestReset} className="space-y-3">
              <div>
                <label className="small">Email</label>
                <input className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
              </div>
              <button className="btn">Find account</button>
            </form>
          ) : (
            <form onSubmit={reset} className="space-y-3">
              <div>
                <label className="small">Email</label>
                <input className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="small">New Password</label>
                <input className="input" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
              </div>
              <button className="btn">Reset password</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
