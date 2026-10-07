import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Utensils, Mail, Lock, User as UserIcon, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import myLogo from '../assets/logo.png';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('user');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role);
            toast.success('Registration successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
            
            <div className="relative w-full max-w-md p-8 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl shadow-lg shadow-teal-500/20">
                        <img src={myLogo} alt="Recipe Nest" className="w-10 h-10 object-contain drop-shadow-md" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Join Recipe Nest</h2>
                <p className="text-slate-300 text-center mb-8 text-sm">Start your culinary journey today</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-slate-400 group-focus-within:text-teal-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full pl-11 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white/10 transition-all sm:text-sm"
                            placeholder="Full Name"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-teal-400 transition-colors" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-11 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white/10 transition-all sm:text-sm"
                            placeholder="Email Address"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-teal-400 transition-colors" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-11 pr-10 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white/10 transition-all sm:text-sm"
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <ShieldCheck className="h-5 w-5 text-slate-400 group-focus-within:text-teal-400 transition-colors" />
                        </div>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="block w-full pl-11 pr-3 py-3 border border-white/10 rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all sm:text-sm appearance-none"
                        >
                            <option value="user">Regular User</option>
                            <option value="chef">Chef Account</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-slate-900 transform transition-all active:scale-[0.98]"
                    >
                        Create Account
                    </button>
                </form>



                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
