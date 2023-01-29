import { FormControl, FormControlLabel, FormHelperText, Grid, RadioGroup, Typography, Radio, TextField, Button, Link } from "@material-ui/core";
import React, { Component } from "react";

export default class CreateRoomPage extends Component {
    defaultVotes = 2;

    constructor(props) {
        super(props);
        this.state = {
            guest_can_pause: true,
            votes_to_skip: this.defaultVotes
        };
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this)
        this.handleVotesChanged = this.handleVotesChanged.bind(this)
        this.handleGuestCanPauseChanged = this.handleGuestCanPauseChanged.bind(this)
    }

    handleVotesChanged(e) {
        this.setState({
            votes_to_skip: e.target.value
        })
    }

    handleGuestCanPauseChanged(e) {
        this.setState({
            guest_can_pause: e.target.value === "true" ? true : false
        })
    }

    handleRoomButtonPressed() {
        console.log('current state = ' + this.state);
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                votes_to_skip: this.state.votes_to_skip,
                guest_can_pause: this.state.guest_can_pause
            })
        }
        fetch('/api/create-room', requestOptions).then((response) => response.json()).then((data) => console.log(data))
    }

    render() {
        return <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    Create A Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup row defaultValue="true"
                        onClick={this.handleGuestCanPauseChanged}>
                        <FormControlLabel value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom" />
                        <FormControlLabel value="false"
                            control={<Radio color="secondary" />}
                            label="No Control"
                            labelPlacement="bottom" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField
                        required={true}
                        type="number"
                        defaultValue={this.defaultVotes}
                        inputProps={{
                            min: 1,
                            style: {
                                textAlign: "center"
                            }
                        }}
                        onChange={this.handleVotesChanged}
                    />
                    <FormHelperText>
                        <div align="center">
                            Votes required to skip song
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained"
                    onClick={this.handleRoomButtonPressed}>Create A Room</Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
            </Grid>

        </Grid>;
    }
}