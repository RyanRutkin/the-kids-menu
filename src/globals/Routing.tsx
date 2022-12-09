import React from 'react';
import {
  Routes,
  Route
} from "react-router-dom";
import { ModalContextProvider } from './contexts/Modal.context';
import { SplashScreenPage } from './pages/SplashScreen/SplashScreen.page';
import { KidsRouting } from './branches/Kids/Routing';
import { AppMainPage } from './pages/Main/Main.page';

export const GlobalsRouting = () => (
	<Route path="/" element={ <ModalContextProvider /> } >
		<Route path="/accept" element={<SplashScreenPage />} />
		{ KidsRouting() }
		<Route index element={<AppMainPage />} />
	</Route>
)