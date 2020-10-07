import classes from './CoinDisplay.module.css';
import React from 'react';
import EthLogo from '../../assets/imgs/ETH.svg';
import LINKLogo from '../../assets/imgs/LINK.svg';
import BtcLogo from '../../assets/imgs/BTC.svg';
import EosLogo from '../../assets/imgs/EOS.svg';

const coinDisplay = props => {

    let coinLogo = null;

    switch (props.coin.name){
        case "BTC":
            coinLogo = BtcLogo;
            break;
        case "ETH":
            coinLogo = EthLogo;
            break;
        case "LINK":
            coinLogo = LINKLogo;
            break;
        case "EOS":
            coinLogo = EosLogo;
            break;
    }

    let lastDay = classes.Red,
        plus = null;

    if(props.coin.lastDay > 0){
        lastDay = classes.Green;
        plus = "+";
    }

    let ChangeClasses = [lastDay, classes.Change].join(' ');
    return (
        <div className={classes.Container}>
            <div className={classes.Logo}><img src={coinLogo}/></div>
            <div className={classes.TickerSymbol}>{props.coin.name}/USD</div>
            <div className={classes.Volume}><span>VOL</span> {props.coin.volume.toLocaleString()} <span>USD</span></div>
            <div className={classes.Low}><span>LOW</span> 379.50</div>
            <div className={classes.Price}>{props.coin.price.toFixed(2)}</div>
             <div className={ChangeClasses}>{plus} {props.coin.lastDay.toFixed(2)} %</div>
            <div className={classes.High}><span>HIGH</span> 394.94</div>
        </div>
    )
}

export default coinDisplay;