import React, { Component } from "react";
import ReactDOM from 'react-dom';
import CreateRoomPage from "./CreateRoomPage";
import HomePage from "./HomePage";
import JoinRoomPage from "./JoinRoomPage";


export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div class="center"><HomePage />
        </div>

    }
}

// const appDiv = document.getElementById("app");
// ReactDOM.render(<App name="Tim"/>, appDiv);