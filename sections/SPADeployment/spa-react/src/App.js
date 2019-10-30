import React, { Component } from 'react';

// Parts of react-router
import {
    Route,
    NavLink,
    HashRouter
} from 'react-router-dom';

// Components/Views
import Home from './components/Home';
import Movies from './components/Movies';
import Profile from './components/Profile';

class App extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <h1>SPA Application</h1>
                    <ul className="header">
                        <li><NavLink exact to="/">Home</NavLink></li>
                        <li><NavLink to="/movies">Movies</NavLink></li>
                        <li><NavLink to="/profile">Profile</NavLink></li>
                    </ul>
                    <div className="content">
                        <Route exact path="/" component={Home} />
                        <Route path="/movies" component={Movies} />
                        <Route path="/profile" component={Profile} />
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default App;