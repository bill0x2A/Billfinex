import React from 'react';
import classes from './Alert.module.css';

const alert = (props) => {

    let alertClasses = classes.Alert;

    if(props.active){
        alertClasses = [classes.Alert, classes.Active].join(' ');
    }
    return (
        <div className={alertClasses}>
            <p>Insufficient balance for this order</p>
        </div>
    )
}


export default alert;