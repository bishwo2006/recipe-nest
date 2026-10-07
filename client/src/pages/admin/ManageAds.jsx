import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Image as ImageIcon, Trash2, Plus } from 'lucide-react';

const ManageAds = () => {
    const { user } = useAuth();
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchAds = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/advertisements', config);
            setAds(data);
        } catch (error) {
            toast.error('Failed to load ads');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!image) return toast.error('An image is required for the ad');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.post('http://localhost:5000/api/admin/advertisements', formData, config);
            toast.success('Ad deployed strictly to platform');
            setTitle('');
            setImage(null);
            setImagePreview(null);
            fetchAds();
        } catch (error) {
            toast.error('Failed to create advertisement');
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Remove this ad permanently?')) {
             try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/admin/advertisements/${id}`, config);
                toast.success('Ad removed');
                fetchAds();
             } catch (error) {
                 toast.error('Failed to remove ad');
             }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <ImageIcon className="w-6 h-6 mr-2 text-rose-500" /> Advertisement Configurations
            </h2>

             {/* Upload Form */}
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col lg:flex-row gap-8">
                <form onSubmit={handleAddSubmit} className="flex-1 space-y-4">
                     <h3 className="text-lg font-semibold text-slate-800 mb-2">Deploy New Ad Slider</h3>
                     <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Ad Title / Campaign</label>
                         <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-rose-500"
                            placeholder="Summer BBQ Sale"
                         />
                     </div>
                     <button type="submit" className="flex items-center justify-center w-full bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-lg font-bold shadow-lg shadow-rose-500/30 transition-colors">
                        <Plus className="w-5 h-5 mr-1" /> Deploy Ad
                     </button>
                </form>

                <div className="flex-1">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Visual Banner Upload</label>
                     <label className={`block w-full border-2 border-dashed ${imagePreview ? 'border-rose-500' : 'border-slate-300'} rounded-2xl p-4 cursor-pointer hover:bg-slate-50 transition-colors h-48 flex flex-col items-center justify-center relative overflow-hidden bg-slate-50`}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <div className="text-center">
                                <ImageIcon className="mx-auto h-10 w-10 text-slate-400" />
                                <span className="mt-2 block text-sm font-medium text-slate-600">Browse Image</span>
                                <span className="mt-1 block text-xs text-slate-400">Optimal size: 1024x250px</span>
                            </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
                    </label>
                </div>
             </div>

             {/* Live Ads */}
             <div>
                 <h3 className="text-lg font-semibold text-slate-800 mb-4">Active Deployments</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {ads.map(ad => (
                         <div key={ad._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative group">
                             <div className="h-32 bg-slate-200">
                                 <img src={`http://localhost:5000${ad.image}`} alt={ad.title} className="w-full h-full object-cover" />
                             </div>
                             <div className="p-4 flex justify-between items-center bg-white border-t border-slate-100 relative z-10">
                                 <div>
                                     <p className="font-bold text-slate-800 truncate">{ad.title}</p>
                                 </div>
                                 <button onClick={() => handleDelete(ad._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                     <Trash2 className="w-5 h-5"/>
                                 </button>
                             </div>
                         </div>
                     ))}
                     {ads.length === 0 && (
                         <div className="col-span-full text-center py-8 text-slate-500">No advertisements are currently deployed.</div>
                     )}
                 </div>
             </div>
        </div>
    );
};

export default ManageAds;
