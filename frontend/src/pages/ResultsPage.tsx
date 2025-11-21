import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import TestResults from "@/components/TestResults";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.test || !location.state?.answers) {
      navigate('/');
    }
  }, [location, navigate]);

  if (!location.state?.test || !location.state?.answers) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <main className="flex-1">
        <TestResults 
          test={location.state.test}
          answers={location.state.answers}
          timeSpent={location.state.timeSpent || 0}
        />
      </main>
    </div>
  );
};

export default ResultsPage;
