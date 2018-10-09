import React, { Component } from 'react';
import DrugItem from './DrugItem';
import Grid from '@material-ui/core/Grid';

class Row extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        var x;
        var that = this;
        function displayRow() {
            var items = [];
            for (x = 0; x < that.props.data.length; x++) {
                items[x] = (
                    <Grid key={x} item xs={3}>
                        <DrugItem key={x * 100} addItem={that.props.addItem} removeItem={that.props.removeItem}
                            name={that.props.data[x].name} quantity={that.props.data[x].quantity}
                            price={that.props.data[x].price} />
                    </Grid>)
            }
            return items;
        }

        return (
            <Grid container spacing={0}>
                {displayRow()}
            </Grid>
        )
    };
};

export default Row;