import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { ImagePlus } from 'lucide-react';

const AddRecipe = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!image) {
            return toast.error('Please select an image for your recipe');
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('ingredients', ingredients);
        formData.append('instructions', instructions);
        formData.append('image', image);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            };
            
            await axios.post('http://localhost:5000/api/recipes', formData, config);
            
            toast.success('Recipe submitted for admin approval!');
            navigate('/chef/my-recipes');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting recipe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Recipe</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Recipe Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-700"
                            placeholder="e.g., Authentic Italian Carbonara"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Box 1: Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Recipe Photo</label>
                            <label className={`block w-full border-2 border-dashed ${imagePreview ? 'border-orange-500' : 'border-slate-300'} rounded-xl p-4 cursor-pointer hover:bg-slate-50 transition-colors h-64 flex flex-col items-center justify-center relative overflow-hidden`}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center">
                                        <ImagePlus className="mx-auto h-12 w-12 text-slate-400" />
                                        <span className="mt-2 block text-sm font-medium text-slate-600">Click to upload an image</span>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
                            </label>
                        </div>
                        
                        {/* Box 2: Ingredients */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Ingredients (One per line)</label>
                            <textarea
                                required
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 p-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-700 h-64 resize-none"
                                placeholder="- 200g Spaghetti&#10;- 100g Pancetta&#10;- 2 large eggs&#10;- 50g Pecorino Romano"
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
                            className="w-full rounded-xl border border-slate-300 p-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-700 h-48 resize-none"
                            placeholder="1. Boil salted water and cook spaghetti...&#10;2. Fry pancetta in a pan until crisp...&#10;3. Whisk eggs and cheese..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Submit to Admin Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRecipe;
