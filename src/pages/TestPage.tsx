import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import TestTaker from "@/components/TestTaker";

const TestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.test) {
      navigate('/');
    }
  }, [location, navigate]);

  if (!location.state?.test) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <main className="flex-1 py-8">
        <TestTaker test={location.state.test} />
      </main>
    </div>
  );
};

export default TestPage;
