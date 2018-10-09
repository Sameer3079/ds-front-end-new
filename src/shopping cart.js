import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import green from '@material-ui/core/colors/green';
import OrderItem from './order item';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { FormGroup } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

const styles = {
    card: {
        minWidth: 275,
        marginBottom: 10,
        marginTop: 10,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    avatar: {
        backgroundColor: green[500],
    },
};

class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentMethodSelection: false,
            value: "Credit Card", // Credit Card / Mobile Number
            useLP: false,
            card: false,
            mobile: false,
            cardDetails: {
                cardNumber: null,
                CVC: null,
                holderName: null,
            },
            mobileDetails: {
                mobileNumber: null,
                PIN: null
            },
        };
    }

    handleCardNumber = event => {
        this.setState({ cardNumber: event.target.value });
    }

    handleCVC = event => {
        this.setState({ CVC: event.target.value });
    }

    handleHolderName = event => {
        this.setState({ holderName: event.target.value });
    }

    handleMobileNumber = event => {
        let mobileDetails = this.state.mobileDetails;
        mobileDetails.mobileNumber = event.target.value;
        this.setState({mobileDetails: mobileDetails});
    }

    handlePIN = event => {
        let mobileDetails = this.state.mobileDetails;
        mobileDetails.PIN = event.target.value;
        this.setState({mobileDetails: mobileDetails});
    }

    handleCardClickOpen = () => {
        this.setState({ card: true });
    };

    handleCardClose = () => {
        this.setState({ card: false });
    };

    handlePaymentClose = () => {
        this.setState({ card: false });
        axios({
            method: 'post',
            url: 'http://localhost:3000/payment/make-payment',
            data: {
                username: this.props.username,
                date: Date.now(),
                type: "Card Payment",
                isCardPayment: true,
                cardNumber: this.state.cardDetails.cardNumber,
                amount: this.props.netPrice,
                CVC: this.state.cardDetails.CVC,
                holderName: this.state.cardDetails.holderName
            },
            config: { headers: { 'Content-Type': 'application/json' } }
        }).then(res => {
            if (res.data.paid === true) {
                this.props.Login();
                alert("Card Payment Successful");
            } else {
                alert("Card Payment Failed");
            }
        })
    };

    handleClickOpen = () => {
        if (this.props.netPrice !== 0 && this.props.loggedIn === true)
            this.setState({ paymentMethodSelection: true });
    };

    NextClose = () => {
        this.setState({ paymentMethodSelection: false });
        if (this.state.value === "Credit Card") {
            this.setState({ card: true });
        } else if (this.state.value === "Mobile Number") {
            this.setState({ mobile: true });
        }
    };

    handleClose = () => {
        this.setState({ paymentMethodSelection: false });
    };

    handleChange = event => {
        this.setState({ value: event.target.value });
    };

    handleCheckboxChange = event => {
        this.setState({ useLP: event.target.checked });
        // console.log(e)
    };

    handleMobileClose = () => {
        this.setState({ mobile: false });
    };

    // 
    handleMobilePayClose = () => {
        this.setState({ mobile: false });
        axios({
            method: 'post',
            url: 'http://localhost:3000/payment/make-payment',
            data: {
                username: this.props.username,
                date: Date.now(),
                type: "Card Payment",
                isCardPayment: false,
                cardNumber: this.state.cardDetails.cardNumber,
                amount: this.props.netPrice,
                CVC: this.state.cardDetails.CVC,
                holderName: this.state.cardDetails.holderName
            },
            config: { headers: { 'Content-Type': 'application/json' } }
        }).then(res => {
            if (res.data.paid === true) {
                this.props.Login();
                alert("Mobile Payment Successful");
            } else {
                alert("Mobile Payment Failed");
            }
        })
    }

    render() {
        const { classes } = this.props;

        var that = this;
        function ListItems() {
            var tempListItems = [];
            var x;
            for (x = 0; x < that.props.orderItems.length; x++) {
                if (that.props.orderItems[x].quantity === 0) {
                    continue;
                }
                else {
                    tempListItems[x] = (
                        <OrderItem key={x} item={that.props.orderItems[x]}/>
                    );
                }
            }
            return tempListItems;
        }

        function checkboxStatus() {
            if (that.props.LP === 0)
                return true;
            else
                return false;
        }

        return (
            <div>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="headline" component="h2">
                            Order
                        </Typography>
                        <Typography className={classes.title} color="textSecondary">
                            Net Price : {"LKR " + this.props.netPrice + "/="}
                        </Typography>
                    </CardContent>
                    <List>
                        {ListItems()}
                    </List>

                    <CardActions>
                        <Button size="small" onClick={this.handleClickOpen}>Proceed</Button>
                    </CardActions>
                </Card>
                <Dialog
                    open={this.state.paymentMethodSelection}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Checkout"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Total Bill Value: <strong>LKR {this.props.netPrice}/=</strong><br />
                            <strong>{this.props.netPrice / 100}</strong> loyalty points will be added with this transaction<br />
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.useLP}
                                            onChange={this.handleCheckboxChange}
                                            value="useLP"
                                            disabled={checkboxStatus()}
                                        />
                                    }
                                    label={"Use Avaiable Loyalty Points(" + this.props.LP + " available)"}
                                />
                            </FormGroup>
                            Select preferred payment method

                        </DialogContentText>

                        <FormControl component="fieldset" className={classes.formControl}>
                            {/* <FormLabel component="legend">Payment Method</FormLabel> */}
                            <RadioGroup
                                aria-label="payment_method_selection"
                                name="payment_method_selection"
                                className={classes.group}
                                value={this.state.value}
                                onChange={this.handleChange}
                            >
                                <FormControlLabel value="Credit Card" control={<Radio />} label="Credit Card (Sampath Bank)" />
                                <FormControlLabel value="Mobile Number" control={<Radio />} label="Mobile Number (Dialog)" />
                            </RadioGroup>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel Checkout
                    </Button>
                        <Button onClick={this.NextClose} color="primary" autoFocus>
                            Next
                    </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.card}
                    onClose={this.handleCardClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Card Details</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter card details and click "Make Payment" to complete the order.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="card_number"
                            label="Card Number"
                            type="text"
                            onChange={this.handleCardNumber}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="cvc_number"
                            label="CVC Number"
                            type="text"
                            onChange={this.handleCVC}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="holder_name"
                            label="Name of Card Holder"
                            type="text"
                            onChange={this.handleHolderName}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCardClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handlePaymentClose} color="primary">
                            Make Payment
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.mobile}
                    onClose={this.handleMobileClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Mobile Details</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter the following details and click "Make Payment" to make the payment.
            </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="mobile_number"
                            label="Mobile Number"
                            type="text"
                            onChangle={this.handleMobileNumber}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="PIN"
                            label="PIN"
                            type="password"
                            onChange={this.handlePIN}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleMobileClose} color="primary">
                            Cancel
            </Button>
                        <Button onClick={this.handleMobilePayClose} color="primary">
                            Make Payment
            </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}

ShoppingCart.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ShoppingCart);
