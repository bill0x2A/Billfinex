import React, { Component } from 'react';
import classes from './Order.module.css';
import EthLogo from '../../../assets/imgs/ETH.svg';
import LINKLogo from '../../../assets/imgs/LINK.svg';
import BtcLogo from '../../../assets/imgs/BTC.svg';
import EosLogo from '../../../assets/imgs/EOS.svg';
import UsdtLogo from '../../../assets/imgs/USDT.svg';

class Order extends Component {

    state = {
        hover: false,
        inCancel : false
    }

    enterHandler = () => {
        if(!this.props.history){
        this.setState({hover: true})}
    }

    leaveHandler = () => {
        if(!this.props.history){
        this.setState({hover: false});}
    }



    render(){

    const thisOrder = this.props.order;
    let coinLogo = null,
        cancelButton = <div className={[classes.Cancel, classes.NoShow].join(' ')}><span>X</span></div>,
        buysell = <span className={classes.Green}>Buy</span>;

    if(!thisOrder.buy){
        buysell = <span className={classes.Red}>Sell</span>;
    }

    if(this.state.hover){
        cancelButton = <div onClick={this.props.cancel} className={classes.Cancel}><span>X</span></div>;
    }

    switch (thisOrder.coin){
        case "BTC":
            coinLogo =  BtcLogo;
            break;
        case "ETH":
            coinLogo =  EthLogo;
            break;
        case "LINK":
            coinLogo =  LINKLogo;
            break;
        case "EOS":
            coinLogo =  EosLogo;
            break;
        case "USDT":
            coinLogo =  UsdtLogo;
            break;
    }
    
    return(
        <div onMouseEnter={this.enterHandler} onMouseLeave={this.leaveHandler} className={classes.GridWrapper}>
        <div className={classes.Order} >
            <span><img src={coinLogo}/> {thisOrder.coin}/USDT</span>
            <span>{buysell}</span>
            <span>{thisOrder.quantity}</span>
            <span>{thisOrder.price}</span>
            <span>{(thisOrder.quantity * thisOrder.price)}</span>
            <span>{thisOrder.date}</span>
        </div>
        {cancelButton}
        </div>
    )}
}

export default Order;