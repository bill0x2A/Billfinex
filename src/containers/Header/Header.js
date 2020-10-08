import classes from './Header.module.css';
import React from 'react';
import Logo from '../../assets/imgs/logo.png';
import Settings from '../../assets/imgs/settings.png';

const Header = (props) => {
    return (
        <div className={classes.Header}>
           <img className={classes.Logo} src={Logo}/>
        </div>
    )
}

export default Header;