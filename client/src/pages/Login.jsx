import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Utensils, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import myLogo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Successfully logged in!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1495195134817-a1a28078ac55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            
            <div className="relative w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500"></div>
                
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <img src={myLogo} alt="Recipe Nest" className="w-10 h-10 object-contain drop-shadow-md" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
                <p className="text-white/70 text-center mb-8">Sign in to your Recipe Nest account</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-white/50 group-focus-within:text-orange-400 transition-colors" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl leading-5 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white/10 transition-all sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-white/50 group-focus-within:text-orange-400 transition-colors" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-10 py-3 border border-white/20 rounded-xl leading-5 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white/10 transition-all sm:text-sm"
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition-all active:scale-[0.98]"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-white/70">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-orange-400 hover:text-orange-300 transition-colors">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
