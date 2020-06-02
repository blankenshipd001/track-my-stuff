import * as React from "react";
import '../App.css';

class Movie extends React.Component {

    state = {
        isLoading: true,
        movies: []
    };

    componentDidMount = async() => {
        const response = await fetch('movie/list');
        const body = await response.json();

        this.setState({ movies: body, isLoading: false});
    }

    render() {
        const { movies, isLoading } = this.state;

        if (isLoading) {
            return <p>Loading Movies...</p>
        }

        return (
            <div className="App">
                <div className="App-Main">
                    <h1>Movies:</h1>
                        { movies.map(movie =>
                            <div key={movie.id}>
                                <div>Title: {movie.title}</div>
                                <div>Runtime: {movie.runtime}</div>
                                <div>Year: {movie.year}</div>
                                <img src={movie.poster} alt=""/>
                                <div />
                            </div>
                        )}
                </div>
            </div>
        );
    }
}

export default Movie;