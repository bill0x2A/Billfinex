import React, { Component } from 'react';
import classes from './Orders.module.css';
import Order from './Order/Order';

class Orders extends Component {

    render(){

    let content = <div>No orders to display</div>,
    dateHeading = <span>Order Date</span>

    if(this.props.orders){
        content = this.props.orders.map(order => <Order cancel = {() => {
            console.log("OrderID!" + order.oID);
            this.props.cancel(order.oID)}
        }
            order={order}
            history={this.props.history}/>)
    }

    if(this.props.history){
        dateHeading = <span>Fill Date</span>
    }
    
    return(
        <div className={classes.Orders} onHover={this.test}>
            <div className={classes.Header}>
            <span>Trading Pair</span>
            <span>Type</span>
            <span>Quantity</span>
            <span>Price (USD)</span>
            <span>Total (USD)</span>
            {dateHeading}
            </div>
            {content}
        </div>
    )}
}

export default Orders;