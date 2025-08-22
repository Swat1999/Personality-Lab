import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../lib/api';
import Link from 'next/link';

export default function Dashboard(){
  const [tests, setTests] = useState([]);

  useEffect(()=>{
    async function load(){ try { const res = await api.get('/tests/my-tests'); setTests(res.data.tests || []); } catch(e){ console.error(e); } }
    load();
  }, []);

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className="card">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Your saved personality tests</h2>
            <Link href="/form" legacyBehavior><a className="btn">Take more tests</a></Link>
          </div>
          <div className="mt-4">
            {tests.length === 0 && <div className="small">No tests yet — try one now!</div>}
            {tests.map(test=>(
              <div key={test.id} className="card mt-3">
                <div className="flex justify-between">
                  <div><strong>{test.personality}</strong><div className="small">{new Date(test.createdAt).toLocaleString()}</div></div>
                  <div className="text-right small">Name: {test.personalInfo?.firstName} {test.personalInfo?.lastName}<div>Occupation: {test.personalInfo?.occupation}</div></div>
                </div>
                <div className="mt-2"><div className="small">Improvements:</div><ul className="list-disc ml-5">{(test.improvements||[]).map((imp,i)=><li key={i} className="small">{imp}</li>)}</ul></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
