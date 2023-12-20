import React, { createContext, useState } from 'react';

// Create a context with a default value
const ProfileContext = createContext();

// Create a provider component
const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);

    const updateProfile = (newProfile) => {
        setProfile(newProfile);
    };

    return (
        <ProfileContext.Provider value={{ profile, updateProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export { ProfileProvider, ProfileContext };