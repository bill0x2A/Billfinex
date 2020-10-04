import React from 'react';
import classes from './Ticker.module.css';
import Classes from './Ticker.module.css';
import EthLogo from '../../assets/imgs/ETH.svg';
import XrpLogo from '../../assets/imgs/XRP.svg';
import BtcLogo from '../../assets/imgs/BTC.svg';
import EosLogo from '../../assets/imgs/EOS.svg';

const ticker = (props) => {
    let lastDay = classes.Red,
        plus = null;

    if(props.coin.lastDay > 0){
        lastDay = classes.Green;
        plus = "+";
    }

    let coinLogo = null;

    switch (props.coin.name){
        case "BTC":
            coinLogo = BtcLogo;
            break;
        case "ETH":
            coinLogo = EthLogo;
            break;
        case "XRP":
            coinLogo = XrpLogo;
            break;
        case "EOS":
            coinLogo = EosLogo;
            break;
    }

    return (
        <div className={classes.Ticker} onClick = { () => {
            props.clicked(props.coin.name);
        }}>
            <img src={coinLogo}></img>
            <strong>{props.coin.name}</strong>
            <span>{props.coin.price.toFixed(2)} USD</span>
    <span className={lastDay}>{plus}{props.coin.lastDay.toFixed(2)} %</span>
            <span>{props.coin.volume.toLocaleString()} USD</span>
        </div>
    )
}


export default ticker;