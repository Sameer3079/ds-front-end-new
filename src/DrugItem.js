import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    card: {
        maxWidth: 300,
        maxHeight: 400,
        marginTop: 10,
        marginBottom: 10,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
});

class DrugItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { quantity: 0, count: 0 };
    }

    state = { expanded: false };

    handleExpandClick = () => {
        this.setState({ expanded: !this.state.expanded });
    };

    getAvatar = (name) => {
        var matches = name.match(/\b(\w)/g);
        var acronym = matches.join('');
        return acronym;
    }

    handleChange(e) {
        if (e.target.value <= this.props.quantity) {
            this.setState({ quantity: e.target.value });
        }
        else {
            this.setState({ quantity: this.props.quantity });
        }
    }

    AddToOrder() {
        let tempCount = this.state.count;
        this.setState({ count: ++tempCount });
        if (this.state.quantity !== 0) {
            this.props.addItem({ name: this.props.name, price: this.props.price, quantity: this.state.quantity });
        } else if (this.state.quantity === 0) {
            this.setState({ count: 0 });
            this.props.removeItem({ name: this.props.name });
            //this.props.addUser({ name: this.props.name, price: this.props.price, quantity: this.state.quantity });
        }
    }

    render() {
        const { classes } = this.props;
        var button, buttonColor;
        if (this.state.count <= 0) {
            buttonColor = "primary";
            button = "Add to Order";
        } else {
            buttonColor = "default";
            button = "Change Quantity";
        }

        return (
            <div>
                <Card className={classes.card}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="Recipe" className={classes.avatar}>
                                {this.getAvatar(this.props.name)}
                            </Avatar>
                        }
                        title={this.props.name}
                        subheader={"LKR " + this.props.price + "/="}
                    />
                    <CardContent>
                        <Typography component="p" paragraph={false}>
                            Quantity Available = {this.props.quantity}
                        </Typography>
                        <Grid container spacing={0}>
                            <Grid item xs={6}>
                                <TextField fullWidth={true} placeholder="Qty" disabled={false} onChange={this.handleChange.bind(this)} value={this.state.quantity} onClick={() => { this.setState({ quantity: '' }) }} />
                            </Grid>
                        </Grid>
                        <br />
                        <Button color={buttonColor} variant="raised" onClick={this.AddToOrder.bind(this)}>
                            {button}
                        </Button>
                    </CardContent>
                    <CardActions className={classes.actions} disableActionSpacing>
                    </CardActions>

                </Card>
            </div>
        );
    }
}

DrugItem.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DrugItem);
