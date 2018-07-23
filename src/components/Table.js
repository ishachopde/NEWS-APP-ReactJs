import PropTypes from "prop-types";
import React, { Component } from 'react';
import '../styles/styles.css';
import {sortBy} from 'lodash';
import {Sort, Button} from './Button';

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'comments'),
    POINTS: list => sortBy(list, 'points').reverse()

}

class Table extends Component{
    constructor(props){
        super(props);
        this.state = {
            sortKey: 'NONE',
            isSortReverse: false
        }
        this.onSort = this.onSort.bind(this);

    }


    // sorting function
    onSort(sortKey){
        const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
        this.setState({
            sortKey,
            isSortReverse
        });
    }

    render(){
        const {result, removeItem} = this.props;
        const { sortKey, isSortReverse } = this.state;
        // console.log(result.searchKey);
        const list = (result) ? result : [];
        console.log("list",list);
        const sortedList = SORTS[sortKey](list);
        const reverseList = isSortReverse ? sortedList.reverse(): sortedList;
        return(
            <div className="col-sm-10 col-sm-offset-1">

                <div className="text-center">
                    <hr/>
                    <Sort className="btn btn-xs btn-default sortBtn" sortKey = {'NONE'} onSort={this.onSort} activeSortKey = {sortKey}>
                        Default
                    </Sort>

                    <Sort className="btn btn-xs btn-default sortBtn" sortKey = {'TITLE'} onSort={this.onSort} activeSortKey = {sortKey}>
                        Title
                    </Sort>

                    <Sort className="btn btn-xs btn-default sortBtn" sortKey = {'AUTHOR'} onSort={this.onSort} activeSortKey = {sortKey}>
                        Author
                    </Sort>

                    <Sort className="btn btn-xs btn-default sortBtn" sortKey = {'COMMENTS'} onSort={this.onSort} activeSortKey = {sortKey}>
                        Comments
                    </Sort>

                    <Sort className="btn btn-xs btn-default sortBtn" sortKey = {'POINTS'} onSort={this.onSort} activeSortKey = {sortKey}>
                        Points
                    </Sort>
                    <hr/>
                </div>

                {

                    // list.filter(isSearched(searchValue)).map( (hit,index) =>
                    reverseList.map( (hit,index) =>
                        <div key={index}>
                            <h3> {hit.title} </h3>
                            <h4> {hit.author} | Comments: {hit.comments} | Points: {hit.points}
                                <Button className="btn btn-danger btn-xs" type="text" onClick={() => removeItem(hit.objectID)}>Remove </Button>
                            </h4>
                            <hr/>
                        </div>

                    )

                }
            </div>
        );
    }
}

Table.propTypes = {
    list: PropTypes.arrayOf(
        PropTypes.shape({
            objectID: PropTypes.string.isRequired,
            author: PropTypes.string,
            comments: PropTypes.string,
            points: PropTypes.number
        })
    ),
    removeItem: PropTypes.func.isRequired
}

export default Table;