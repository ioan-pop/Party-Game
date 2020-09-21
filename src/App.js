import React from 'react';
import './App.css';
import MainMenu from './Components/MainMenu/MainMenu';
import Game from './Components/Game/Game';
import PostGame from './Components/PostGame/PostGame';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// TODO: Remove the app component and include the main menu inside index.js
function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<Switch>
					<Route path="/postgame" component={PostGame} />
					<Route path="/game" component={Game} />
					<Route path="/" component={MainMenu} />
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default App;
