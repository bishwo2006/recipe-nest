import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Mail, ArrowLeft } from 'lucide-react';
import myLogo from '../assets/logo.png';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
            toast.success('Simulation: Email sent! Modifying routing layer to mock an inbox click...', { duration: 4000 });
            
            // Mocking the scenario where a user clicks their email link 2 seconds later.
            setTimeout(() => {
                 navigate(data.mockResetUrl);
            }, 3000);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to dispatch email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
            
            <div className="relative w-full max-w-md p-8 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                <button onClick={() => navigate('/login')} className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors">
                     <ArrowLeft className="w-6 h-6"/>
                </button>
                
                <div className="flex justify-center mb-4 mt-4">
                    <div className="p-3 bg-gradient-to-tr from-teal-500 to-cyan-400 rounded-2xl shadow-lg shadow-cyan-500/20">
                        <img src={myLogo} alt="Recipe Nest" className="w-10 h-10 object-contain drop-shadow-md" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Account Recovery</h2>
                <p className="text-slate-300 text-center mb-8 text-sm px-4">Enter your registered email address and we'll dispatch a link to securely reset your password.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-11 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white/10 transition-all sm:text-sm"
                            placeholder="Email Address"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transform transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? 'Transmitting Request...' : 'Send Recovery Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
