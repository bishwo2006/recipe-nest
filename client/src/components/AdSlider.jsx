import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const AdSlider = () => {
    const [ads, setAds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/public/advertisements')
            .then(({ data }) => setAds(data))
            .catch(() => {});
    }, []);

    const startTimer = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % ads.length);
        }, 4000);
    };

    useEffect(() => {
        if (ads.length <= 1) return;
        startTimer();
        return () => clearInterval(intervalRef.current);
    }, [ads]);

    const goTo = (index) => {
        setCurrentIndex(index);
        startTimer(); // reset timer on manual nav
    };

    if (ads.length === 0) return null;

    return (
        <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 relative bg-black" style={{ height: '200px' }}>

            {/* Slides */}
            {ads.map((ad, index) => (
                <div
                    key={ad._id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <img
                        src={`http://localhost:5000${ad.image}`}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Bottom bar label — not overlapping the main image center */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-4 flex items-end justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Ad</span>
                            <span className="text-white font-semibold text-sm drop-shadow">{ad.title}</span>
                        </div>
                        {/* Slide counter */}
                        <span className="text-white/60 text-xs font-medium">{index + 1} / {ads.length}</span>
                    </div>
                </div>
            ))}

            {/* Dot Indicators */}
            {ads.length > 1 && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20">
                    {ads.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`rounded-full transition-all duration-300 ${
                                i === currentIndex
                                    ? 'bg-white w-5 h-2'
                                    : 'bg-white/40 hover:bg-white/70 w-2 h-2'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Progress bar */}
            {ads.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
                    <div
                        key={currentIndex}
                        className="h-full bg-orange-500 animate-progress"
                        style={{ animationDuration: '4s' }}
                    />
                </div>
            )}
        </div>
    );
};

export default AdSlider;
