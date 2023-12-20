import React, { createContext, useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
    const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
    const PROFILE_KEY = process.env.REACT_APP_PROFILE_KEY;

    const decrypt = (encryptedData) => {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('Error decrypting data:', error);
            return null;
        }
    };

    const encrypt = (data) => {
        return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    };

    const storedEncryptedProfile = localStorage.getItem(PROFILE_KEY);
    const [profile, setProfile] = useState(() => {
        try {
            const decryptedProfile = storedEncryptedProfile ? JSON.parse(decrypt(storedEncryptedProfile)) : null;
            if (decryptedProfile && decryptedProfile.data && decryptedProfile.expiration) {
                const expirationDate = new Date(decryptedProfile.expiration);
                if (expirationDate > new Date()) {
                    return decryptedProfile.data;
                } else {
                    localStorage.removeItem(PROFILE_KEY);
                }
            }
        } catch (error) {
            console.error('Error parsing decrypted profile:', error);
        }
        return null;
    });

    useEffect(() => {
        if (profile) {
            const expiration = new Date();
            expiration.setMinutes(expiration.getDate() + 1);

            const encryptedProfile = encrypt(JSON.stringify({ data: profile, expiration: expiration.toISOString() }));
            localStorage.setItem(PROFILE_KEY, encryptedProfile);
        } else {
            localStorage.removeItem(PROFILE_KEY);
        }
    }, [profile]);

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
