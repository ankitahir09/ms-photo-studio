import { motion } from 'framer-motion';
import React from 'react';

function LogoLoader() {
    return (
        <div
            className="fixed inset-0 bg-black z-50 flex justify-center items-center"
        >
            <motion.img
                src='https://res.cloudinary.com/dkmv3uyvz/image/upload/v1752823360/logo_oc6jfs.png'
                alt='Murlidhar Studio'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1 }}
                className='w-48 h-48 object-contain'
            />
        </div>
    );
}

export default LogoLoader;