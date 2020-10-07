import React from 'react';
import classes from './Alert.module.css';

const alert = (props) => {

    let alertClasses = [classes.Alert];
    let message = <p>Insufficient balance for this order</p>;

    if(props.success){
        message = <p>Transaction successful!</p>
        alertClasses.push(classes.Success);
    }

    if(props.active){
        alertClasses.push(classes.Active);
    }

    alertClasses = alertClasses.join(' ');  
    
    return (
        <div className={alertClasses}>
            {message}
        </div>
    )
}


export default alert;