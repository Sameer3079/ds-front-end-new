import React, { Component } from 'react';
import './App.css';
import Header from './header';
import AllDrugs from './AllDrugs';
import ShoppingCart from './shopping cart';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class App extends Component {
  constructor(props) {
    super(props);
    // This block of code gets the IP of the backend server using the IP address of the front end server
    // Assuming that the front end and back end servers are running within the same computer
    var url = window.location.href; // url = "http://192.168.1.2:3001
    url = url.split("//", 2); // url = ["http:", "192.168.1.2:3001"]
    url = url[1]; // url = "192.168.1.2/3001"
    url = url.split(":"); // url = ["192.168.1.2", "3001"]
    url = url[0]; // url = "192.168.1.2"
    // States
    this.state = {
      serverURL: url, // IP address of the front end server
      orderItems: [], // will contain the order items
      netPrice: 0, // will contain the total price of the order items
      username: '', // will contain the username of the user after he has logged in
      name: '', // will contain the name of the user once he has logged in
      password: '', // will contain the password of the user after he has logged in
      points: 0, // the loyalty points will be stored here once the user has logged in
      loggedIn: false, // true if the user has logged in else false
      invalidCredentials: false, // if true the Dialog which says the credentials are invalid will be displayed, if false it won't be displayed
    };
  }

  // Purpose: to calculate the netprice and store it in the state
  // Called: it is called when either an item is added or removed from the orderItems array
  RecalculateNetPrice() {
    let tempNetPrice = 0;
    let tempOrderItems = this.state.orderItems;
    tempOrderItems.map(foodItem => {
      tempNetPrice = tempNetPrice + (foodItem.price * foodItem.quantity);
    });
    this.setState({ netPrice: tempNetPrice });
  }

  // Purpose: stores the username in textfield in the state as {username: #####}
  // Called:  when the text in the username textfield changes. The textfield exists within the header.js -> Dialog
  UpdateUsername(event) {
    this.setState({ username: event.target.value });
  }

  // Purpose: stores the password in textfield in the state as {username: #####}
  // Called:  when the text in the password textfield changes. The textfield exists within the header.js -> Dialog
  UpdatePassword(event) {
    this.setState({ password: event.target.value });
  }

  // Purpose: to check whether a user with the given username and password exists
  Login = () => {
    axios({
      method: 'post',
      url: 'http://' + this.state.serverURL + ':3000/user/login',
      data: { username: this.state.username, password: this.state.password },
      config: { headers: { 'Content-Type': 'application/json' } }
    }).then(res => {
      if (res.data.status == true) {
        this.setState({ loggedIn: true });
        this.setState({ name: res.data.user.name }); // storing the name in the state
        this.setState({ points: res.data.user.points }); // storing the loyalty points in the state
      } else {
        this.handleClickOpen(); // will set {invalidCredentials: ###} to TRUE which in turn will display the invalidCredentialsDialog
      }
    })
  }
  // Purpose: to set the state of invalidCredentials in state to TRUE which in turn will display the invalidCredentialsDialog
  // Called: in line 76,  when the login fails
  handleClickOpen = () => {
    this.setState({ invalidCredentials: true });
  };

  // Purpose: to set the state of invalidCredentials in state to FALSE which in turn will close the invalidCredentialsDialog
  // Called: when the "Ok" button of the invalidCredentialsDialog is clicked
  handleClose = () => {
    this.setState({ invalidCredentials: false });
  };

  // Purpose: to delete a food Item from the orderItems array
  // Called: in deleteOrderItem() line:124
  deleteItem(foodItem) {
    let x;
    let tempOrderItems = this.state.orderItems;
    for (x = 0; x < tempOrderItems.length; x++) {
      if (foodItem.name == tempOrderItems[x].name) {
        tempOrderItems.splice(x, 1);
        this.setState({ orderItems: tempOrderItems });
        return true;
      }
    }
  }

  // Purpose: to add a food Item to the order Items array
  // Called: in "Add to Order"/"Change Quantity" button in foodItem.js
  addOrderItem(foodItem) {
    this.deleteItem(foodItem); // If the food Item already exists, delete it
    if (foodItem.quantity === 0) { // If the QTY = 0 then it does not need to be added
      return -1;
    } else { // Adding the item to the orderItems array
      // tempOrderItems is used because the state cannot be directly modified in ReactJS
      let tempOrderItems = this.state.orderItems;
      tempOrderItems.push({ name: foodItem.name, price: foodItem.price, quantity: foodItem.quantity });
      this.setState({
        orderItems: tempOrderItems
      });
    }
    this.RecalculateNetPrice();
  }

  // Called: in "Add to Order"/"Change Quantity" button in foodItem.js AND in addOrderItem (in case the quantity of an added Item is being changed)
  deleteOrderItem(foodItem) {
    this.deleteItem(foodItem);
    this.RecalculateNetPrice();
  }

  render() {
    return (
      // Only one tag can be return in ReactJS so all the tags are wrapped around by a single DIV tag
      <div className="App">
        {/* The bar at the top of the page the*/}
        <Header UpdateUsername={this.UpdateUsername.bind(this)} UpdatePassword={this.UpdatePassword.bind(this)}
          Login={this.Login.bind(this)} loggedIn={this.state.loggedIn} name={this.state.name}
          points={this.state.points} />
        <Grid container spacing={0}>
          <Grid item xs={10}>
            <AllDrugs addItem={this.addOrderItem.bind(this)} removeItem={this.deleteOrderItem.bind(this)} backEndURL={this.state.serverURL} />
          </Grid>
          <Grid item xs={2}>
            <ShoppingCart netPrice={this.state.netPrice} LP={this.state.points} loggedIn={this.state.loggedIn}
              orderItems={this.state.orderItems}
              username={this.state.username} Login={this.Login.bind(this)}/>
          </Grid>
        </Grid>
        <Dialog
          open={this.state.invalidCredentials}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Login Failed"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Either the user does not exist or the credentials are invalid
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default App;
