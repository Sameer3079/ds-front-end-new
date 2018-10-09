import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';
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

class OrderItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subtotal: (this.props.item.quantity * this.props.item.price),
            item: this.props.item
        }
    }

    getAvatar(name) {
        var matches = name.match(/\b(\w)/g);
        var acronym = matches.join('');
        return acronym;
    }


    DeleteOrderItem() {
        this.state.removeOrderItem({ name: this.props.name });
    }

    render() {
        const { classes } = this.props;

        return (
            <ListItem>
                <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                        {this.getAvatar(this.props.item.name)}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={this.props.item.quantity + "x " + this.props.item.name + "( " + (this.props.item.quantity * this.props.item.price) + " )"}
                />
            </ListItem>
        );
    }
}

OrderItem.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderItem);