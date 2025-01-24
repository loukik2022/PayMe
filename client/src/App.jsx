import { BrowserRouter as Router, Route, Routes, useSearchParams } from 'react-router-dom';
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import Subscriptions from './pages/landingPage';
import SuccessPage from './pages/successPage';
import CancelPage from './pages/cancelPage';
import './App.css';

const StripeRoute = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
        return <SuccessPage />;
    }

    if (canceled === 'true') {
        return <CancelPage />;
    }

    return (
        <div>
            <h1>Invalid Page</h1>
            <a href="/">Return to Home</a>
        </div>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/landing" element={<Subscriptions />} />
                <Route path="/stripe" element={<StripeRoute />} />
                {/* Other routes */}
            </Routes>
        </Router>
    );
}

export default App;
