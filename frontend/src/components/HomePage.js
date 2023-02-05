import React, { Component } from "react";
import CreateRoomPage from "./CreateRoomPage";
import JoinRoomPage from "./JoinRoomPage";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Typography, Grid, Button, ButtonGroup } from "@material-ui/core";
import Room from "./Room";
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null
        }
    }

    async componentDidMount() {
        fetch('/api/user-in-room').then((response) => response.json()).then((data) => {
            this.setState({
                roomCode: data.code
            })
        })
    }

    renderHomePage() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" component="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained"
                        color="primary">
                        <Button color="primary" to="/join" component={Link}>
                            Join A Room
                        </Button>
                        <Button color="secondary" to="/create" component={Link}>
                            Create A Room
                        </Button>
                    </ButtonGroup>

                </Grid>
            </Grid>
        );
    }

    render() {
        return (<Router>
            <Switch>
                <Route exact path="/" render={() => {
                    return this.state.roomCode ? (<Redirect to={`/room/${this.state.roomCode}`} />) : this.renderHomePage()

                }} />
                <Route path="/join" component={JoinRoomPage} />
                <Route path="/create" component={CreateRoomPage} />
                <Route path="/room/:roomCode" component={Room} />
            </Switch>
        </Router>)
    }
}