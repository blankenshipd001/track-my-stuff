import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {Route, withRouter} from "react-router-dom";
import Switch from "react-bootstrap/cjs/Switch";
import SearchResultsPage from "./pages/SearchResultsPage";
import RouteNotFoundPage from "./pages/RouteNotFoundPage";
import MainPage from "./pages/MainPage";
import SearchBar from "./SearchBar";
import Movie from "./Movie";


class Workspace extends React.Component {
    handleRoute = route => () => {
        this.props.history.push({ pathname: route });
    };

    render() {
        return (
            <>
                <Navbar bg="dark" variant="dark">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={this.handleRoute("/")}>Home</Nav.Link>
                    </Nav>
                    <SearchBar history={this.props.history}/>
                </Navbar>
                <Switch>
                    <Route exact path={"/"} component={MainPage} />
                    <Route exact path={"/results"} component={SearchResultsPage} />
                    <Route component={RouteNotFoundPage} />
                </Switch>
            </>
        );
    }
}

export default withRouter(Workspace);