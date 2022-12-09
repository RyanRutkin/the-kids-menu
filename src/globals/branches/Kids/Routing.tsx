import React from 'react';
import {
  Routes,
  Route
} from "react-router-dom";
import { KidsPage } from './pages/Kids/Kids.page';
import { KidsContextProvider } from './contexts/Kids.context';

export const KidsRouting = () => (
	<Route path="/kids" element={ <KidsContextProvider /> }>
		<Route index element={ <KidsPage /> } />
	</Route>
)