import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Lock, Eye, EyeOff } from 'lucide-react';
import myLogo from '../assets/logo.png';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.put(`http://localhost:5000/api/auth/resetpassword/${token}`, { password });
            toast.success('Password Successfully Modified!', { duration: 4000 });
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Token may be expired or invalid');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
            
            <div className="relative w-full max-w-md p-8 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex justify-center mb-4 mt-4">
                    <div className="p-3 bg-gradient-to-tr from-cyan-500 to-emerald-400 rounded-2xl shadow-lg shadow-emerald-500/20">
                        <img src={myLogo} alt="Recipe Nest" className="w-10 h-10 object-contain drop-shadow-md" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Set New Password</h2>
                <p className="text-slate-300 text-center mb-8 text-sm px-4">Securely input your new permanent password below.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                     <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-11 pr-10 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white/10 transition-all sm:text-sm"
                            placeholder="New Secure Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-900 transform transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? 'Securing Profile...' : 'Lock in Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
