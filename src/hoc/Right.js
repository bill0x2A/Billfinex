import React from 'react';
import classes from './Right.module.css';

const right = props => (
    <div className = {classes.Right}>
        {props.children}
    </div>
)

export default right;