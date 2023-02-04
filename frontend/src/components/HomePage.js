import React, {Component } from "react";
import CreateRoomPage from "./CreateRoomPage";
import JoinRoomPage from "./JoinRoomPage";
import { BrowserRouter as Router,  Switch, Route, Link, Redirect} from "react-router-dom";
import Room from "./Room";
export default class HomePage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<Router>
            <Switch>
                <Route exact path="/"><p>This is the HOME PAGE</p></Route>
                <Route path="/join" component={JoinRoomPage}/>
                <Route path="/create" component={CreateRoomPage}/>
                <Route path="/room/:roomCode" component={Room}/>
            </Switch>
        </Router>)
    }
}