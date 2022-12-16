import React from 'react';
import {
  Route
} from "react-router-dom";
import { SplashScreenPage } from './pages/SplashScreen/SplashScreen.page';
import { KidsRouting } from './branches/Kids/Routing';
import { AppMainPage } from './pages/Main/Main.page';
import { ContextCollection } from './contexts/ContextCollection';

export const GlobalsRouting = () => (
	<Route path="/" element={ <ContextCollection /> } >
		<Route path="/accept" element={<SplashScreenPage />} />
		{ KidsRouting() }
		<Route index element={<AppMainPage />} />
	</Route>
)