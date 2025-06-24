import Header from "./Header";
import {Outlet} from "react-router-dom";
import { useAuth } from './context/AuthContext';
import { Link } from 'react-router-dom';

export default function Layout() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Animated Background Elements (from Register/Login) */}
      <div className="absolute inset-0 bg-gradient-to-br from-space-black via-cosmic-navy to-void-purple z-0"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-bounce z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-electric-blue/10 rounded-full blur-2xl animate-pulse z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-pink/5 animate-pulse z-0"></div>
      {/* Main Content */}
      <div className="relative z-10 py-4 px-8 flex flex-col min-h-screen max-w-4xl mx-auto">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}