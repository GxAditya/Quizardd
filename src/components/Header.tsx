
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/40 backdrop-blur-md shadow-lg border-b border-amber-100/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <Target className="w-6 h-6 text-white" />
          </div>
          <div>
              <span className="font-bold text-xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Quizardd
            </span>
            <p className="text-xs text-gray-600">Master Learning</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;

