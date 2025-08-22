import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import api from '../lib/api';
import { analyzePersonalityClient, suggestImprovements } from '../utils/personality';

export default function FormPage(){
  const router = useRouter();
  const [personal, setPersonal] = useState({ firstName:'', lastName:'', age:'', dob:'', occupation:'Business', maritalStatus:'Single' });
  const [answers, setAnswers] = useState({
    prefersAlone: 'Alone', teamPlayer: 'team player', accountability: 'Yes', likesGoingOut: 'Going out',
    openToCriticism: 'Yes', approachable: 'Yes', readingOrMovies: 'Reading books', getsTriggered: 'No', keepUpTrends: 'Yes', easyGoing: 'Yes'
  });
  const [result, setResult] = useState(null);
  const [improvements, setImprovements] = useState([]);

  const handlePersonalChange = (k,v) => setPersonal({...personal,[k]:v});
  const handleAnswerChange = (k,v) => setAnswers({...answers,[k]:v});

  const analyze = () => {
    const personality = analyzePersonalityClient(answers);
    setResult(personality);
    setImprovements(suggestImprovements(answers));
  };

  const [lastTestId, setLastTestId] = useState(null);

  const save = async () => {
    try {
      const personality = analyzePersonalityClient(answers);
      const res = await api.post('/tests/save', { personalInfo: {...personal, age: Number(personal.age), dob: personal.dob }, answers, personality });
      if (res.data.id) setLastTestId(res.data.id);
      alert('Saved!');
      router.push('/dashboard');
    } catch (err) {
      alert(err?.response?.data?.error || 'Save failed');
    }
  };

  const [showImproveModal, setShowImproveModal] = useState(false);
  const [improveList, setImproveList] = useState([]);

  const helpMeImprove = async () => {
    const personality = analyzePersonalityClient(answers);
    setResult(personality);

    const suggestions = suggestImprovements(answers);
    setImprovements(suggestions);
    setImproveList(suggestions);
    setShowImproveModal(true);

    if (lastTestId) {
      try {
        await api.put(`/tests/update/${lastTestId}`, { improvements: suggestions });
        } catch (err) {
          console.error("Update failed", err);
        }
      } else {
        console.warn("No lastTestId found — make sure you confirm & save first.");
      }
    };

  return (
    <div>
      <Navbar />
      <main className="container">
        <div className="card">
          <h2 className="text-xl font-bold mb-2">Section 1 — Personal Information</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="small">First name</label><input className="input" value={personal.firstName} onChange={e=>handlePersonalChange('firstName', e.target.value)} /></div>
            <div><label className="small">Last name</label><input className="input" value={personal.lastName} onChange={e=>handlePersonalChange('lastName', e.target.value)} /></div>
            <div><label className="small">Age</label><input className="input" type="number" value={personal.age} onChange={e=>handlePersonalChange('age', e.target.value)} /></div>
            <div><label className="small">DOB</label><input className="input" type="date" value={personal.dob} onChange={e=>handlePersonalChange('dob', e.target.value)} /></div>
            <div><label className="small">Occupation</label>
              <select className="input" value={personal.occupation} onChange={e=>handlePersonalChange('occupation', e.target.value)}>
                <option>Business</option><option>Profession</option><option>Student</option><option>Unemployed</option><option>Others</option>
              </select></div>
            <div><label className="small">Marital status</label>
              <select className="input" value={personal.maritalStatus} onChange={e=>handlePersonalChange('maritalStatus', e.target.value)}>
                <option>Single</option><option>Married</option><option>Widowed</option><option>Prefer not to say</option>
              </select></div>
          </div>

          <h2 className="text-xl font-bold mt-4 mb-2">Section 2 — Questions</h2>
          <div className="space-y-3">
            <div>
              <label className="small">1. Do you prefer living alone or with family or partner?</label>
              <select className="input" value={answers.prefersAlone} onChange={e=>handleAnswerChange('prefersAlone', e.target.value)}>
                <option>Alone</option><option>Family</option><option>partner</option>
              </select>
            </div>
            <div>
              <label className="small">2. Are you a team player, prefer working alone or both?</label>
              <select className="input" value={answers.teamPlayer} onChange={e=>handleAnswerChange('teamPlayer', e.target.value)}>
                <option>team player</option><option>individual</option><option>both</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="small">3. Do you take accountability for your actions?</label>
                <select className="input" value={answers.accountability} onChange={e=>handleAnswerChange('accountability', e.target.value)}><option>Yes</option><option>No</option></select></div>
              <div><label className="small">4. Do you like going out or staying in?</label>
                <select className="input" value={answers.likesGoingOut} onChange={e=>handleAnswerChange('likesGoingOut', e.target.value)}><option>Going out</option><option>Staying in</option></select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="small">5. Are you open to take criticism?</label>
                <select className="input" value={answers.openToCriticism} onChange={e=>handleAnswerChange('openToCriticism', e.target.value)}><option>Yes</option><option>No</option></select></div>
              <div><label className="small">6. Are you easily approachable?</label>
                <select className="input" value={answers.approachable} onChange={e=>handleAnswerChange('approachable', e.target.value)}><option>Yes</option><option>No</option></select></div>
            </div>
            <div>
              <label className="small">7. Do you prefer reading books or watching movies or both?</label>
              <select className="input" value={answers.readingOrMovies} onChange={e=>handleAnswerChange('readingOrMovies', e.target.value)}><option>Reading books</option><option>Watching movies</option><option>both</option></select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="small">8. Do you get easily triggered?</label><select className="input" value={answers.getsTriggered} onChange={e=>handleAnswerChange('getsTriggered', e.target.value)}><option>No</option><option>Yes</option></select></div>
              <div><label className="small">9. Do you keep up with latest trends?</label><select className="input" value={answers.keepUpTrends} onChange={e=>handleAnswerChange('keepUpTrends', e.target.value)}><option>Yes</option><option>No</option></select></div>
            </div>
            <div><label className="small">10. Are you easy going?</label><select className="input" value={answers.easyGoing} onChange={e=>handleAnswerChange('easyGoing', e.target.value)}><option>Yes</option><option>No</option></select></div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={analyze} className="btn">Analyze</button>
            <button onClick={save} className="btn">Confirm & Save</button>
            <button onClick={helpMeImprove} className="btn">Help me improve</button>
          </div>

          {result && (
            <div className="mt-4">
              <h3 className="font-bold">Your personality: {result}</h3>
              <div className="mt-2"><h4 className="font-semibold">Suggested improvements:</h4><ul className="list-disc ml-5">{improvements.map((it,i)=><li key={i} className="small">{it}</li>)}</ul></div>
            </div>
          )}
        </div>
      </main>
      {showImproveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Improvement Suggestions</h2>
            <ul className="list-disc ml-5 space-y-2">
              {improveList.map((item, i) => (
                <li key={i} className="text-sm">{item}</li>
                ))}
            </ul>
            <div className="flex justify-end mt-4">
            <button
            onClick={() => setShowImproveModal(false)}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Close
            </button>
          </div>
    </div>
    </div>
  )}
  </div>
  );
}
