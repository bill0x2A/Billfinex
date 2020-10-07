import React, { Component } from 'react';
import classes from './Tutorial.module.css';

class Tutorial extends Component {

    state = {
        startingQuantity : 10000,
        profitGoal       : 40000
    }

    startingQuantityChangeHandler = (e) => {
        this.setState({startingQuantity : e.target.value})
    }

    profitGoalChangeHandler = (e) => {
        this.setState({profitGoal: e.target.value})
    }
    render (){
    return (
        <div className={classes.Container}>
            <div className={classes.Tutorial}>
                <div className = {classes.Header}>
                    <h2>Welcome to Billfinex</h2>
                </div>
                <div className={classes.Content}>
                <p>This is a simplified imitation of a cryptocurrency exchange. All the price data is generated in your browser, note that if you have another tab selected data generation will stop.</p>
                <p>The different coins all have their own behaiviours, try and turn your starting capital we've given you into untold riches!</p>
                <p>Buy and sell your coins by placing buy and sell orders on the left</p>
                <p>Click through the different coins to see all the various price action!</p>
                <p>Enjoy playing around</p>
                <div className = {classes.Inputs}>
                    <div className={classes.Starting}>
                        <h3>Starting Money</h3>
                        <input
                            type = 'number'
                            min = {0}
                            onChange = {this.startingQuantityChangeHandler}
                            value = {this.state.startingQuantity}
                            ></input>
                    </div>
                    <div className={classes.Goal}>
                        <h3>Set your goal</h3>
                        <input
                            type = 'number'
                            min = {2 * this.state.profitGoal}
                            onChange = {this.profitGoalChangeHandler}
                            value = {this.state.profitGoal}
                            ></input>
                    </div>

                </div>
                <div className = {classes.LetsGo}
                    onClick = {this.props.endTutorial}>Let's Go!</div>
                </div>
            </div>
        </div>
    )}
}

export default Tutorial;