import React from 'react';
import classes from './Footer.module.css';
import reactimg from '../../assets/imgs/react.png';

const footer = () => {
    return (
        <div className={classes.Footer}>
            <p>Built by Billy Smith with <img src={reactimg}/> 2020</p>
        </div>
    )
}


export default footer;