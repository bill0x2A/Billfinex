import React, { Component } from 'react';
import classes from './OrderForm.module.css';

class OrderForm extends Component {

    state = {
        orderType : 'limit',
        quantity : 10,
        price : this.props.coin.price
    }

    componentDidUpdate(prevProps) {
        if(this.props.coin.name !== prevProps.coin.name){
            this.setState({price : this.props.coin.price, quantity: 0});
        }
    }

    orderTypeChangeHandler = (e) => {
        this.setState({orderType:e.target.value, price:this.props.coin.price});
    }

    priceChangeHandler = (e) => {
        this.setState({price : e.target.value})
    }

    quantityChangeHandler = (e) => {
        this.setState({quantity: e.target.value})
    }

    getTime = () => {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = time + ' ' + date;
        return dateTime;
    }

    generateID = () => {
        return [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    render(){

        let overlay = null;

        if(this.state.quantity !== 0){
            overlay = <div className={classes.Total}><p>≈ {(this.state.price * this.state.quantity).toLocaleString()} USD</p></div>
        }

    return (
        <div className={classes.OrderForm}>
            <select
                onChange={this.orderTypeChangeHandler}
                name="orderType" id="orderTypes">
            <option value="limit">Limit</option>
            <option value="market">Market</option>
            </select>
            <div className={classes.UsdPrice}>
                <h3>USD PRICE</h3>
                <input
                    min={0}
                    disabled={this.state.orderType==='market'}
                    type='number' value={this.state.price}
                    onChange = {this.priceChangeHandler}
                    ></input>
                {overlay}
            </div>
            <div className={classes.CoinAmount}>
            <h3>{this.props.coin.name} AMOUNT</h3>
                <input
                    min={0}
                    onChange = {this.quantityChangeHandler}
                    type='number' value={this.state.quantity}
                    ></input>
            </div>
            <div className={classes.Sell}>
                <h3>BID</h3>
                <div onClick = {() => this.props.buy(
                    {
                        coin : this.props.coin.name,
                        price : this.state.price,
                        quantity : this.state.quantity,
                        date : this.getTime(),
                        buy : false,
                        oID : this.generateID()
                    }
                )}
                className={classes.SellButton}><strong>SELL</strong></div>
            </div>
            <div className={classes.Buy}>
                <h3>ASK</h3>
                <div onClick = {() => this.props.buy(
                    {
                        coin : this.props.coin.name,
                        price : this.state.price,
                        quantity : this.state.quantity,
                        date : this.getTime(),
                        buy : true,
                        oID : this.generateID()
                    }
                )} className={classes.BuyButton}><strong>BUY</strong></div>
            </div>
        </div>
    )}
}

export default OrderForm;