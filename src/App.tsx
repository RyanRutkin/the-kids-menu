import React from 'react';
import { Routes } from 'react-router-dom';
import './App.css';
import { GlobalsRouting } from './globals/Routing';

const App = () => <Routes>
	{ GlobalsRouting() }
</Routes>

export default App;
