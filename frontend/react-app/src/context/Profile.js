import React, { createContext, useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
    const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
    const PROFILE_KEY = process.env.REACT_APP_PROFILE_KEY;
    const sessionUser = localStorage.getItem("token");

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

    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const storedEncryptedProfile = localStorage.getItem(PROFILE_KEY);

        if (storedEncryptedProfile) {
            try {
                const decryptedProfile = JSON.parse(decrypt(storedEncryptedProfile));

                const expirationDate = new Date(decryptedProfile.expiration);
                if (expirationDate > new Date()) {
                    setProfile(decryptedProfile.data);
                } else {
                    localStorage.removeItem(PROFILE_KEY);
                }
            } catch (error) {
                console.error('Error parsing decrypted profile:', error);
                localStorage.removeItem(PROFILE_KEY);
            }
        }
    }, [PROFILE_KEY]);

    useEffect(() => {
        if (sessionUser === null) {
            setProfile(null);
            localStorage.removeItem(PROFILE_KEY);
        }
    }, [sessionUser, PROFILE_KEY]);

    const updateProfile = (newProfile) => {
        setProfile(newProfile);

        const expiration = new Date();
        expiration.setDate(expiration.getDate() + 1);

        const encryptedProfile = encrypt(JSON.stringify({ data: newProfile, expiration: expiration.toISOString() }));
        localStorage.setItem(PROFILE_KEY, encryptedProfile);
    };

    const clearProfileData = () => {
        setProfile(null);
        localStorage.removeItem(PROFILE_KEY);
    };

    return (
        <ProfileContext.Provider value={{ profile, updateProfile, clearProfileData }}>
            {children}
        </ProfileContext.Provider>
    );
};

export { ProfileProvider, ProfileContext };
