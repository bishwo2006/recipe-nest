import React from 'react';
import chefImg from '../assets/chef-icon.png';

const ChefIcon = ({ className = "w-5 h-5" }) => {
    return (
        <img src={chefImg} alt="Chef" className={`${className} object-contain`} />
    );
};

export default ChefIcon;
