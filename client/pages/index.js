import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="container">
        <div className="card text-center">
          <h1 className="text-3xl font-bold mb-2">✨ Personality Lab</h1>
          <p className="small mb-4">Discover your personality and get tips to improve.</p>
          <div className="flex justify-center gap-4">
            <Link href="/signup"><button className="btn">Get Started</button></Link>
            <Link href="/signin"><button className="btn">Sign In</button></Link>
          </div>
        </div>
      </main>
    </div>
  );
}
