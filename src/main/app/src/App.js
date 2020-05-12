import React, {Component} from 'react';
import './App.css';

//
// class App extends Component {
//   state = {
//     isLoading: true,
//     groups: []
//   };
//
//   async componentDidMount() {
//     const response = await fetch('movie/list');
//     const body = await response.json();
//     this.setState({groups: body, isLoading: false});
//   }
//
//   render() {
//     const {groups, isLoading} = this.state;
//
//     if (isLoading) {
//       return <p>Loading...</p>
//     }
//
//     return (
//         <div className="App">
//           <header className="App-header">
//             <img src={logo} className="App-logo" alt="logo"/>
//             <div className="App-intro">
//               <h2>List</h2>
//               {groups.map(group =>
//                   <div key={group.id}>
//                     {group.name}
//                   </div>
//               )}
//             </div>
//           </header>
//         </div>
//     );
//   }
// }

class App extends Component {

    state = {
        isLoading: true,
        movies: []
    };

    async componentDidMount() {
        const response = await fetch('movie/list');
        const body = await response.json();
        console.log(body);
        this.setState({movies: body, isLoading: false});
    };

    render() {
        const {movies, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>
        }

        return (
            <div className="App">
                <div className="App-Main">
                    <h2>List</h2>
                    {movies.map(movie =>
                        <div key={movie.id}>
                            {movie.title}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default App;
