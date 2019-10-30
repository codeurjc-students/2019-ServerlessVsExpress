import React, { Component } from 'react';
import {default as moviesService} from '../services/moviesService';

class Profile extends Component {
    state = {
        favMovies: []
    };

    async componentDidMount() {
        const result = await moviesService.getMoviesByTitle('Jurassic Park', 1);
        const favMovies = await result.json();
        
        if(favMovies.Response === "True") {
            this.setState({favMovies: favMovies.Search});
        }
    }

    displayFavMovies() {
        let favMovies = [];

        this.state.favMovies.map((movie, index) => 
        {
            return favMovies.push(
                <div className="movie" key={index}>
                    <div className="left-content">
                        <div className="poster">
                            {movie.Poster !== "N/A" ? 
                                <img alt={movie.Title + '-img'} src={movie.Poster} />
                            : ""}
                        </div>
                    </div>
                    <div className="right-content">
                        <div className="title">{movie.Title}</div>
                        <div className="year">{movie.Year}</div>
                        <div className="imdb-link"><a target="blank" href={"https://www.imdb.com/title/" + movie.imdbID}>imDB info</a></div>
                    </div>
                </div>
            );
        });

        return favMovies;
    }

    render() {
        return (
            <div>
                <h2>Profile</h2>
                <div className="profile-container-movies">
                    <h3>Favorite movies</h3>
                    <div className="favorite-movies">
                        {this.displayFavMovies()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;