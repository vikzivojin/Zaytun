import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
 
const ScrollToTop = () => {
  // Get the current location object
  const { pathname } = useLocation();
 
  // Trigger scroll to top on route change
  useEffect(() => {
    // Scroll to top of the page
    window.scrollTo(0, 0);
  }, [pathname]); // Re-run effect when pathname changes
 
  return null; // This component doesn't render anything
};
 
export default ScrollToTop;