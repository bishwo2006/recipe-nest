import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ value, onChange }) => (
    <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => onChange && onChange(star)}>
                <Star className={`w-6 h-6 transition-colors ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 hover:text-yellow-300'}`} />
            </button>
        ))}
    </div>
);

export default StarRating;
