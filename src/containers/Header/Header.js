import classes from './Header.module.css';
import React from 'react';
import Logo from '../../assets/imgs/logo.png'

const Header = (props) => {
    return (
        <div className={classes.Header}>
            <img src={Logo}/>
        </div>
    )
}

export default Header;