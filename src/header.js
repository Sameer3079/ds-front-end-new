import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};
class ButtonAppBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
        this.props.Login();
    };

    justClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        var that = this;
        function displayLoginButton() {
            if (that.props.loggedIn == false) {
                return (<Button color="inherit" onClick={that.handleClickOpen}>Login</Button>);
            }
            else {
                return (<Typography variant="subheading" color="inherit">You are logged in as {that.props.name}</Typography>);
            }
        }

        function displayLoyaltyPoints() {
            if (that.props.loggedIn == true) {
                return (<Typography variant="textsecondary" color="inherit">Loyalty Points: {that.props.points}</Typography>);
            }
        }

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        {displayLoyaltyPoints()}
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            Online Drugs Store
                        </Typography>
                        {displayLoginButton()}
                    </Toolbar>
                </AppBar>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Login (username: admin, password: admin)</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Login credentials will be lost on page reload.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="username"
                            label="Username"
                            type="text"
                            fullWidth
                            onChange={this.props.UpdateUsername}
                        />
                        <TextField
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            onChange={this.props.UpdatePassword}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.justClose} color="primary">
                            Cancel
                </Button>
                        <Button onClick={this.handleClose} color="primary">
                            Login
                </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
