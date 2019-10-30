import React, { Component } from 'react';
import {default as moviesService} from '../services/moviesService';

class Movies extends Component {

    state = {
        titleToSearch: '',
        pageToSearch: 1,
        movies: [],
        numOfPages: 0
    };

    handleInput(event) {
        this.setState({titleToSearch: event.target.value});
    }

    handlePageNumber(event, nPage) {
        this.setState({pageToSearch: nPage});
        this.getMoviesByTitle();
    }

    async getMoviesByTitle() {
        const {titleToSearch, pageToSearch} = this.state;
        const result = await moviesService.getMoviesByTitle(titleToSearch, pageToSearch);
        const movies = await result.json();
        
        if(movies.Response === "True") {
            this.setState({
                movies: movies.Search,
                numOfPages: Math.floor(movies.totalResults / 10)
            });
        }
    }

    renderPagination() {
        const {pageToSearch, numOfPages} = this.state;

        let pageButtons = [];

        if(numOfPages > 2 && pageToSearch > 2) {
            pageButtons.push(<button onClick={e => this.handlePageNumber(e, 1)}>First page</button>);
        }

        if(pageToSearch > 1) {
            pageButtons.push(<button onClick={e => this.handlePageNumber(e, pageToSearch - 1)}>{pageToSearch - 1}</button>);
        }

        if(numOfPages > 1) {
            pageButtons.push(<button className="active-page">{pageToSearch}</button>);
        }

        if(pageToSearch < numOfPages) {
            pageButtons.push(<button onClick={e => this.handlePageNumber(e, pageToSearch + 1)}>{pageToSearch + 1}</button>);
        }

        if(numOfPages > 2 && pageToSearch < numOfPages - 1) {
            pageButtons.push(<button onClick={e => this.handlePageNumber(e, numOfPages)}>Last page</button>);
        }
        
        return pageButtons;
    }

    render() {
        let {movies} = this.state;

        return (
            <div>
                <h2>Search Movies</h2>
                <div className="container-searchby">
                    <input type="text" className="searchby" placeholder="Search by title" onChange={e => this.handleInput(e)}/>
                    <button type="button" onClick={this.getMoviesByTitle.bind(this)}>Search</button>
                </div>
                <div className="movies">
                    {
                        movies.map((movie, index) => {
                            return (
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
                            )
                        })
                    }
                </div>
                <div className="pagination-container">
                    {this.renderPagination()}
                </div>
            </div>
        );
    }
}

export default Movies;