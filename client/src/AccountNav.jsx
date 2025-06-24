import {Link, useLocation} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function AccountNav() {
  const {pathname} = useLocation();
  const { isLandlord } = useAuth();
  let subpage = pathname.split('/')?.[2];
  if (subpage === undefined) {
    subpage = 'profile';
  }
  function linkClasses (type=null) {
    let classes = 'inline-flex gap-1 py-2 px-6 rounded-full transition-all duration-200';
    if (type === subpage || (type === 'properties' && subpage === 'properties/new')) {
      classes += ' bg-gradient-primary-btn text-white shadow-neon-glow-pink';
    } else {
      classes += ' bg-glass-light text-holo-silver hover:bg-glass-medium hover:text-neon-cyan';
    }
    return classes;
  }
  return (
    <nav className="w-full flex justify-center mt-8 gap-2 mb-8 p-1 rounded-full bg-void-purple shadow-glass-shadow backdrop-blur-strong">
      {isLandlord() && (
        <>
         <Link className={linkClasses('properties')} to={'/account/properties/new'}>
              Upload
              </Link>
             </>
      )}
    </nav>
  );
}