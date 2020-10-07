import React, { Component } from 'react';
import './App.css';
import './Graph.css';
import Dropdown from './containers/Dropdown/Dropdown';
import Ticker from './containers/Ticker/Ticker';
import Header from './containers/Header/Header';
import Footer from './containers/Footer/Footer';
import Main from './hoc/Main';
import CoinDisplay from './containers/CoinDisplay/CoinDisplay';
import OrderForm from './containers/OrderForm/OrderForm';
import Balaces from './containers/Balances/Balances';
import Graph from './components/Graph/Graph';
import Sidebar from './hoc/Sidebar';
import Right from './hoc/Right.js';
import Orders from './components/Orders/Orders';
import Modal from './containers/Modal/Modal';
import Draggable from 'react-draggable';
import Alert from './containers/Alert/Alert';
import Tutorial from './containers/Tutorial/Tutorial';

class App extends Component {

  state = {
    orderSuccess: false,
    showTickers : true,
    alert       : false,
    showOrderForm : true,
    showBalances : true,
    showOrders    : true,
    showOrderHistory    : false,
    confirming          : false,
    orderToCancel       : null,
    cryptos : [
       {
        name : "BTC",
        price : 10073,
        lastDay : -2.5,
        volume : 362412054
      },  
      {
        name : "ETH",
        price : 379,
        lastDay : 1.5,
        volume : 240958551
      },
      {
        name : "LINK",
        price : 8.82,
        lastDay : 1.84,
        volume : 24587292
      },
      {
        name : "EOS",
        price : 2.74,
        lastDay : 0.48,
        volume : 2828294
      }      
    ],
    balances : {
      BTC : 0,
      ETH : 0,
      USDT : 30000,
      EOS : 0,
      LINK : 0
    },
    selectedCoin : {
      name : "BTC",
      price : 10073,
      lastDay : -2.5,
      volume : 362412054
    },
    height : 0,
    width : 0,
    orders : [
    ],
    orderHistory : []
  }

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  changeShowTickerHandler = () => {
    this.setState({showTickers : !this.state.showTickers});
  }

  changeShowBalancesHandler = () => {
    this.setState({showBalances : !this.state.showBalances});
  }


  changeShowOrderFormHandler = () => {
    this.setState({showOrderForm : !this.state.showOrderForm});
  }
  
  changeShowOrdersHandler = () => {
    this.setState({showOrders : !this.state.showOrders});
  }

  changeShowOrderHistoryHandler = () => {
    this.setState({showOrderHistory : !this.state.showOrderHistory});
  }

  changeCoin = (coin) => {
    const name = coin;
    let i = 0;

    for(i=0;i<this.state.cryptos.length;i++){
      let thisCoin = this.state.cryptos[i];
      if(thisCoin.name === name){
        this.setState({selectedCoin:thisCoin});
      }
    }
  }

  newOrderHandler = (order) => {
    let currentOrders = [...this.state.orders];

    if((!order.buy && this.state.balances[order.coin] >= order.quantity) || (order.buy && this.state.balances.USDT >= (order.quantity * order.price))){
      currentOrders.unshift(order);

      let newBalances = this.state.balances;

      if(order.buy){
        console.log('Subtracting' + (order.quantity * order.price) + " from USDT balance");
        newBalances.USDT -= (order.quantity * order.price);
      } else {
        newBalances[order.coin] -= order.quantity;
        console.log("Subtracting " + (order.quantity) + " from BTC balance");
      }

      this.setState({orders:currentOrders, balances:newBalances});

    } else {
      this.toggleAlertHandler();
      setTimeout(this.toggleAlertHandler, 2000);
    }
  }

  orderFufillmentHandler = (order) => {
    let newBalances = this.state.balances;

    if(order.buy){
      newBalances[order.coin] = parseFloat(newBalances[order.coin]) + parseFloat(order.quantity);
    } else {
      newBalances.USDT += (order.quantity * order.price);
    }

    let newOrderHistory = [...this.state.orderHistory];
    
    newOrderHistory.unshift(order);
    this.toggleSuccessHandler();
    this.toggleAlertHandler();
    setTimeout(this.off, 2000);
    this.cancelOrderHandler(order.oID);
    this.setState({balances:newBalances, orderHistory:newOrderHistory});
  }

  toggleAlertHandler = () => {

    this.setState({alert : !this.state.alert})
  }

  toggleSuccessHandler = () => {

    this.setState({orderSuccess : !this.state.orderSuccess})
  }

  off = () => {
    this.setState({alert:false, success:false});
  }

  cancelOrderHandler = (orderToCancel) => {
    let currentOrders = [...this.state.orders];
    orderToCancel = orderToCancel || this.state.orderToCancel;

    currentOrders.map((order, index) => {
      if(order.oID === orderToCancel){
        currentOrders.splice(index, 1);
        this.setState({orders:currentOrders, orderToCancel:null, confirming:false});
      }
    })

  }

  priceChangeHandler = (prices) => {

    let cryptos = [...this.state.cryptos];

    for(let i=0;i<prices.length;i++){
      for(let j=0;j<cryptos.length;j++){
        if(prices[i].name === cryptos[j].name){
          cryptos[j].price = parseFloat(prices[i].price);
          cryptos[j].volume += Math.round(Math.random() * 3000);
        }
      }
    }
    this.setState({cryptos:cryptos});
  }

  closeModalHandler = () => {
    this.setState({confirming:false, orderToCancel: null});
  }

  checkCancelConfirmation = (oID) => {
    this.setState({confirming:true, orderToCancel:oID})
  }

  render(){

    let selectedCoin = this.state.selectedCoin,
        modal        = null,
        alert        = null;
    const newWidth = this.state.width - 520;

    if(this.state.confirming){
      modal =  <Modal close = {this.closeModalHandler} confirm = {this.cancelOrderHandler}/>
    }

    if(this.state.alert){
      alert = <Alert/>
    }

    const orders = this.state.orders,
          cryptos = this.state.cryptos;

    for(let i=0;i<orders.length;i++){
      for(let j=0;j<cryptos.length;j++){
        if(orders[i].coin == cryptos[j].name){
          if(orders[i].buy && orders[i].price >= cryptos[j].price){

            this.orderFufillmentHandler(orders[i]);
          }
          if(!orders[i].buy && orders[i].price <= cryptos[j].price){

            this.orderFufillmentHandler(orders[i])
          }
        }
      }
    }

    return (
      <div className="App">
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet"></link>
        {modal}

        <Alert active = {this.state.alert} success={this.state.orderSuccess}/>
        <Header/>

        <Main>
          <Sidebar>
            <CoinDisplay coin = {selectedCoin}/>

            <Dropdown name = {"TICKERS"}click = {this.changeShowTickerHandler} width = {'450px'} show={this.state.showTickers}>
              {this.state.cryptos.map(crypto => (
                <Ticker clicked = {this.changeCoin} coin = {crypto}/>
              ))}
            </Dropdown>

            <Dropdown name = {"ORDER FORM"} click = {this.changeShowOrderFormHandler} width = {'450px'} show={this.state.showOrderForm}>
              <OrderForm buy = {(order) => this.newOrderHandler(order)} coin={this.state.selectedCoin} balances = {this.state.balances}/>
            </Dropdown>

            <Dropdown name = {"BALANCES"} click = {this.changeShowBalancesHandler} width = {'450px'} show={this.state.showBalances}>
              <Balaces balances = {this.state.balances}/>
            </Dropdown>

          </Sidebar>
          <Right>
            <Graph
              width = {newWidth}
              coin={this.state.selectedCoin}
              trend={"normal"}
              changePrice={newPrices => {this.priceChangeHandler(newPrices)}}
              cryptos = {this.state.cryptos}
              />
            <Dropdown name={"ORDERS (" + this.state.orders.length + ")"} width = {newWidth} click = {this.changeShowOrdersHandler} show = {this.state.showOrders}>
                <Orders orders={this.state.orders} cancel = {(oID) => this.checkCancelConfirmation(oID)} cryptos = {this.state.cryptos}/>
            </Dropdown>
            <Dropdown name={"ORDER HISTORY (" + this.state.orderHistory.length + ")"} width = {newWidth} click = {this.changeShowOrderHistoryHandler} show = {this.state.showOrderHistory}>
                <Orders history orders={this.state.orderHistory} cancel = { () => console.log('') }/>
            </Dropdown>
          </Right>
        </Main>
        <Footer/>
      </div>
    );}
}

export default App;
