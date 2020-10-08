import React, { Component } from 'react';
import classes from './Balances.module.css';
import EthLogo from '../../assets/imgs/ETH.svg';
import LINKLogo from '../../assets/imgs/LINK.svg';
import BtcLogo from '../../assets/imgs/BTC.svg';
import EosLogo from '../../assets/imgs/EOS.svg';
import UsdtLogo from '../../assets/imgs/USDT.svg';


const balances = (props) => {

    let currencies = [
            {
                name : "BTC",
                exchangeBalance : props.balances.BTC,
                marginBalance   : 0,
                fundingBalance  : 0
            },
            {
                name : "USDT",
                exchangeBalance : props.balances.USDT,
                marginBalance   : 0,
                fundingBalance  : 0
            },
            {
                name : "EOS",
                exchangeBalance : props.balances.EOS,
                marginBalance   : 0,
                fundingBalance  : 0
            },
            {
                name : "ETH",
                exchangeBalance : props.balances.ETH,
                marginBalance   : 0,
                fundingBalance  : 0
            },
            {
                name : "LINK",
                exchangeBalance : props.balances.LINK,
                marginBalance   : 0,
                fundingBalance  : 0
            }
        ]


    function logoSelector(coinName) {
        switch (coinName){
            case "BTC":
                return BtcLogo;
            case "ETH":
                return EthLogo;
            case "LINK":
                return LINKLogo;
            case "EOS":
                return EosLogo;
            case "USDT":
                return UsdtLogo;
        }
    }

        return (
            <div className={classes.Balances}>
                <div className={classes.Heading}>
                    <p style = {{textAlign:"left",marginLeft:"10px"}} >NAME</p>
                    <p>EXCHANGE</p>
                    <p>MARGIN</p>
                    <p>FUNDING</p>
                </div>
                    {currencies.map(currency => (
                            <div key = {currency.name} className={classes.Currency}>
                                <span className={classes.Name}><img src={logoSelector(currency.name)}/><p>{currency.name}</p></span>
                                <span>{currency.exchangeBalance}</span>
                                <span>{currency.marginBalance}</span>
                                <span>{currency.fundingBalance}</span>
                            </div>
                        )
                     )
                    }
                    <div className={classes.Total}>TOTAL WEALTH: {props.total} USDT</div>
            </div>
        )
}

export default balances;