import SearchBar from "./SearchBar";
import '../custom.scss';
import React from "react";

class NavigationBar extends React.Component {

    render() {
        return (
            <header className="navbar navbar-expand-lg navbar-expand-md navbar-expand-sm">
                <div className="container-fluid">
                    <div className="navbar-brand">

                    </div>

                    <SearchBar />
                </div>
            </header>
        );
    }
}

export default NavigationBar;