import React from 'react';
import classes from './Dropdown.module.css';
import Draggable from 'react-draggable';

const dropdown = (props) => {
    let content = <div className = {classes.NoShow}></div>,
        rotate = classes.Arrow;

    if(props.show){
        content = <div className = {classes.Content}>{props.children}</div>;
        rotate = [classes.Rotate, classes.Arrow].join(' ');
    }

    return (

        <div className={classes.Container} style={{width : props.width}}>
            <div onClick = {props.click} className = {classes.Header}><span className={rotate}>&#10148;</span>  {props.name}</div>
            {content}
        </div>

    )
}


export default dropdown;