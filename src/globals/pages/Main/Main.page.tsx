import React, { useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage.hook';
import { redirect, useNavigate } from "react-router-dom";

export const AppMainPage = () => {
    const [ accepted ] = useLocalStorage<boolean>("storage_accepted_2", false);
    const navigate = useNavigate();

    useEffect(() => {
        if (accepted) {
            console.log('Redirecting to /kids');
            navigate("/kids");
        } else {
            console.log('Redirecting to /accept');
            navigate("/accept");
        }
    }, [ accepted ]);

    return <div>Test</div>
}