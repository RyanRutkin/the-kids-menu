import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '../../components/Button/Button.component';
import { AppPage } from '../../components/Page/Page.component';
import { useLocalStorage } from '../../hooks/useLocalStorage.hook';
import './SplashScreen.page.css';

export const SplashScreenPage = () => {
    const [ _, setAccepted ] = useLocalStorage<boolean>("storage_accepted", true);
    const navigate = useNavigate();

    return (
        <AppPage>
            <div className="app-splash-screen-content-wrapper" >
                <div className="app-splash-screen-content" >
                    <div className="app-splash-screen-title" >
                        The Kid's Menu
                    </div>
                    <div className="app-splash-screen-disclaimer" >
                        All data shown within the app will be stored on your device. This data will not be transferable between devices. By clicking accept, you allow The Kid's Menu to store application data to you device and accept that the data will only be accessible from your device.
                    </div>
                    <div className="app-splash-screen-button-wrapper" >
                        <AppButton onClick={ () => {
                            setAccepted(true);
                            navigate('/kids');
                        }} >Accept</AppButton>
                    </div>
                </div>
            </div>
        </AppPage>
    )
}
