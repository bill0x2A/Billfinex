import React from 'react';
import classes from './Modal.module.css';

const modal = (props) => {


    return (
        <div className={classes.Container}>
            <div className={classes.Modal}>
                <div onClick={props.close} className = {classes.Close}>X</div>
                <h2>Are you sure you wish to cancel this order?</h2>
                <div onClick = {props.confirm} className = {classes.Confirm}>Confirm</div>
            </div>
        </div> 
    )
}

export default modal;