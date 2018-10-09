import React, { Component } from 'react';
// import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Row from './Row';

class AllDrugs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: 0,
            data: []
        };
        this.getData();
    }

    getData() {
        let URL = 'http://' + this.props.backEndURL + ':3000/drugs/get-drugs';
        axios.get(URL).then(res => {
            this.setState({
                x: this.state.x,
                data: res.data
            });
        });
    }

    render() {
        function chunkArray(myArray, chunk_size) {
            var index = 0;
            var arrayLength = myArray.length;
            var tempArray = [];
            let myChunk;

            for (index = 0; index < arrayLength; index += chunk_size) {
                myChunk = myArray.slice(index, index + chunk_size);
                tempArray.push(myChunk);
            }

            return tempArray;
        }

        // Outputs : [ [1,2,3] , [4,5,6] ,[7,8] ]
        var foodItemsInRows = chunkArray(this.state.data, 4);
        var that = this; // this is taken into a variable because for some reason this is not accessible inside functions which are in the render method
        function displayFood() {
            let x, rows = [];
            for (x = 0; x < foodItemsInRows.length; x++) {
                rows[x] = <Row key={x} data={foodItemsInRows[x]}
                    spacing={0} addItem={that.props.addItem}
                    removeItem={that.props.removeItem} />;
            }
            return rows;
        }

        return (
            <div>
                {displayFood()}
            </div >
        )
    }
}

export default AllDrugs;
