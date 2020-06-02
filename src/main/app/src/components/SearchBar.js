import React, { Component } from 'react';
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class SearchBar extends Component {
    state = {
        movieSearchText: ""
    };

    handleSearchInput = event => {
        this.setState({
            movieSearchText: event.target.value
        });
    };

    handleSearchSubmit = () => {
        if (this.state.movieSearchText) {
            let text = this.state.movieSearchText;
            this.setState({ movieSearchText: "" });
            this.props.history.push({
                pathname: "/results",
                state: { movieSearchText: text }
            });
        } else {
            // alert("Nothing in the search... how are we supposed to find something?")
        }
    };

    /**
     * Handle allowing the user to press the `Enter` key to submit the search
     * @param event keyEvent
     */
    handleSearchKeyUp = event => {
        event.preventDefault();
        if (event.key === 'Enter' && event.keyCode === 13) {
            this.handleSearchSubmit();
        }
    }

    handleFormSubmit = event => event.preventDefault();

    render() {
        return (
            <Form inline onSubmit={this.handleFormSubmit}>
                <FormControl onChange={this.handleSearchInput}
                             value={this.state.movieSearchText}
                             onKeyUp={this.handleSearchKeyUp}
                             type="text"
                             placholder="Search..."
                             className="mr-sm-2"
                />
                <Button onClick={this.handleSearchSubmit} variant="outline-info">
                    Search
                </Button>
            </Form>
        );
    }
}

export default SearchBar;