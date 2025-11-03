import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  SignedIn, 
  SignedOut, 
  RedirectToSignIn,
  useUser 
} from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import SymptomDetail from './pages/SymptomDetail';
// import FindFacilities from './pages/FindFacilities';
import Dashboard from './pages/Dashboard';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />                    
            <Route path="/" element={<Home />} />
            <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
             <Route path="/symptoms/:id" element={<SymptomDetail />} />
            {/* <Route path="/find-facilities" element={<FindFacilities />} /> */}
            
            {/* Protected Route */}
            <Route 
              path="/dashboard" 
              element={
                <>
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              } 
            />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
