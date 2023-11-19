import React from 'react';

const NavSignUp = () => {
    return (
        <nav className="bg-beige p-4 pt-12 mx-auto max-w-screen-lg">
            <div className="flex justify-center items-center">
                {/* Your logo or branding can go here */}
                <a href="/" className="font-bold text-2xl text-gray-800">Home &nbsp;</a>

                {/* Navigation links with increased spacing */}
                <div className="flex space-x-8">
                    <a href="/bookings" className="text-2xl font-bold text-gray-600 hover:text-gray-800">Booking &nbsp;</a>
                    <a href="/inventory" className="text-2xl font-bold text-gray-600 hover:text-gray-800">Inventory</a>
                    {/* Add more links as needed */}
                </div>
            </div>
        </nav>
    );
};

export default NavSignUp;
