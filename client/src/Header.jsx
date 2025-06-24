import { Link } from "react-router-dom";
import { useAuth } from './context/AuthContext';

export default function Header() {
  const { user, isAdmin, isLandlord, logout } = useAuth();
  const firstName = user?.name?.split(' ')[0] || '';

  if (!user) {
    return (
      <div className="flex justify-center w-full">
        <header className="flex justify-center items-center py-4 px-4 bg-gradient-hero shadow-card rounded-b-lg min-h-[80px] min-w-[900px]">
          <div className="flex items-center gap-8">
            <Link to={'/properties'} className="flex items-center gap-2 min-w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 text-primary-blue">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              <span className="font-bold text-2xl text-primary-blue tracking-tight">CampusNest</span>
            </Link>

            <div className="border border-gray-200 rounded-full py-3 px-8 shadow-md bg-white/80 text-gray-700 text-lg font-semibold whitespace-nowrap">
              Find PGs, Flats near NSUT
            </div>

            <Link to={'/login'} className="flex items-center gap-2 border border-gray-200 rounded-full py-2 px-4 shadow-card bg-gradient-feature text-gray-700 hover:shadow-elevated transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-blue flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <div className="bg-primary-blue/10 text-primary-blue rounded-full border border-primary-blue flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="currentColor" className="w-6 h-6 relative top-1">
                  <path fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 
                    .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 
                    0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full">
      <header className="flex justify-between items-center py-4 px-4 bg-gradient-hero shadow-card rounded-b-lg min-h-[80px] gap-6 min-w-[900px]">
        <Link to={'/properties'} className="flex items-center gap-2 min-w-fit">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 text-primary-blue">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          <span className="font-bold text-2xl text-primary-blue tracking-tight">CampusNest</span>
        </Link>

        <div className="flex-1 flex justify-center mx-2 min-w-0">
          <div className="border border-gray-200 rounded-full py-3 px-6 shadow-md bg-white/80 text-gray-700 text-lg font-semibold whitespace-nowrap">
            Find PGs, Flats near NSUT
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isLandlord() && (
            <Link
              to="/account/properties/new"
              className="px-4 py-2 rounded-full bg-primary-green text-white font-semibold shadow-md hover:bg-primary-teal transition-colors text-sm"
            >
              Upload Property
            </Link>
          )}

          <div className="flex items-center gap-2 border border-gray-200 rounded-full py-2 px-3 shadow-card bg-gradient-feature text-gray-700 cursor-default select-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-blue flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <div className="bg-primary-blue/10 text-primary-blue rounded-full border border-primary-blue flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="currentColor" className="w-5 h-5 relative top-1">
                <path fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 
                  .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 
                  0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="font-semibold text-primary-blue whitespace-nowrap text-sm">{firstName}</div>
          </div>

          <button
            onClick={logout}
            className="px-3 py-2 rounded-full border border-primary-green bg-gradient-success text-white font-semibold shadow-md hover:from-primary-teal hover:to-primary-green transition-colors duration-200 whitespace-nowrap text-sm"
          >
            Logout
          </button>
        </div>
      </header>
    </div>
  );
}
