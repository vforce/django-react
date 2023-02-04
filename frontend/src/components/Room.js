import React, { Component } from "react";

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
    }

    getRoomDetails() {
        fetch('/api/get-room?code=' + this.roomCode).then((response) => response.json()).then((data) => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host
            })
        })
    }

    render() {
        return <div>
            <h3>Room Code: {this.roomCode} </h3>
            <p>Votes to skip: {this.state.votesToSkip.toString()}</p>
            <p>Guest can pause: {this.state.guestCanPause.toString()}</p>
            <p>Is host: {this.state.isHost.toString()}</p>
        </div>
    }
}