const API_KEY = "YOUR_API_KEY_FROM_OMDBAPI";

const getMoviesByTitle = (title, nPage) => {
    return fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${title}&page=${nPage}&type=Movie&plot=full`);
};

export default {
    getMoviesByTitle
};

