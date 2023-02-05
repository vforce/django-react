import { Button, Typography, Grid } from "@material-ui/core";
import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

export default class Room extends Component {
    constructor(props) {
        super(props)
        this.state = {
            votesToSkip: 1,
            guestCanPause: false,
            isHost: false
        }
        this.roomCode = this.props.match.params.roomCode;
        this.getRoomDetails()
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this)
    }

    leaveButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch('/api/leave-room', requestOptions).then((response) => {
            this.props.history.push('/');
        });
    }

    getRoomDetails() {
        fetch('/api/get-room?code=' + this.roomCode).then((response) => {
            if (!response.ok) {
                console.log('room does not exist')
                this.props.leaveRoomCallback();
                this.props.history.push('/')
            }
            return response.json()
        }).then((data) => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host
            })
        })
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {this.roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Votes to skip: {this.state.votesToSkip.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Guest can pause: {this.state.guestCanPause.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Is Host: {this.state.isHost.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary"
                        onClick={this.leaveButtonPressed}>Leave Room</Button>
                </Grid>
            </Grid>
        )

        // <div>
        //     <h3>Room Code: {this.roomCode} </h3>
        //     <p>Votes to skip: {this.state.votesToSkip.toString()}</p>
        //     <p>Guest can pause: {this.state.guestCanPause.toString()}</p>
        //     <p>Is host: {this.state.isHost.toString()}</p>
        // </div>
    }
}