import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { ImagePlus, ArrowLeft } from 'lucide-react';

const EditRecipe = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/recipes/${id}`, config);
                
                // Ensure this chef owns the recipe (Backend already validates edits, but good UX to halt here)
                if(data.chef.toString() !== user._id.toString()) {
                    toast.error("You cannot edit a recipe you didn't create.");
                    return navigate('/chef/my-recipes');
                }

                setTitle(data.title);
                setIngredients(data.ingredients);
                setInstructions(data.instructions);
                setImagePreview(`http://localhost:5000${data.image}`);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to load recipe details');
                navigate('/chef/my-recipes');
            }
        };

        fetchRecipe();
    }, [id, user.token, user._id, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('ingredients', ingredients);
        formData.append('instructions', instructions);
        
        // Only append image if the user selected a NEW one
        if (image) {
            formData.append('image', image);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            };
            
            await axios.put(`http://localhost:5000/api/recipes/${id}`, formData, config);
            
            toast.success('Modifications submitted. Changing status to Pending Review!');
            navigate('/chef/my-recipes');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating recipe');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">Loading recipe data...</div>;

    return (
        <div className="max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
            <div className="p-8 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                <div>
                     <h2 className="text-2xl font-bold text-amber-900">Edit Recipe Logic</h2>
                     <p className="text-amber-700 text-sm mt-1">Warning: Validating changes will set this recipe back to Pending.</p>
                </div>
                <button onClick={() => navigate('/chef/my-recipes')} className="flex items-center text-amber-800 hover:text-amber-600 bg-amber-200/50 px-4 py-2 rounded-lg font-medium transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back
                </button>
            </div>
            
            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Recipe Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-700 font-semibold"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Box 1: Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Recipe Photo (Click to change)</label>
                            <label className={`block w-full border-2 border-dashed ${imagePreview ? 'border-orange-500' : 'border-slate-300'} rounded-xl p-4 cursor-pointer hover:bg-slate-50 transition-colors h-64 flex flex-col items-center justify-center relative overflow-hidden group`}>
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                             <span className="text-white font-bold tracking-wider">Change Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <ImagePlus className="mx-auto h-12 w-12 text-slate-400" />
                                        <span className="mt-2 block text-sm font-medium text-slate-600">Click to upload an image</span>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                            <p className="text-xs text-slate-400 mt-2">Leave blank to retain original image.</p>
                        </div>
                        
                        {/* Box 2: Ingredients */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Ingredients</label>
                            <textarea
                                required
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 p-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-700 h-64 resize-none leading-relaxed"
                            ></textarea>
                        </div>
                    </div>

                    {/* Box 3: Instructions */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Cooking Instructions</label>
                        <textarea
                            required
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 p-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-700 h-48 resize-none leading-relaxed"
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100 space-x-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center"
                        >
                            {submitting ? 'Applying Changes...' : 'Resubmit for Admin Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRecipe;
