import React, { Component } from 'react';
import './App.css';
import Workspace from "./components/Workspace";
import {BrowserRouter} from "react-router-dom";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Workspace />
            </BrowserRouter>
        )
    }
}

export default App;
