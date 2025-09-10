import { Outlet } from 'react-router-dom';
import { Header } from './components';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />           {/* always mounted */}
      <main className="pt-16">  {/* header height offset (64px) */}
        <Outlet />
      </main>
    </div>
  );
}
