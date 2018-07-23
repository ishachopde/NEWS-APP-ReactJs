import PropTypes from "prop-types";
import React, { Component } from 'react';
import '../styles/styles.css';

export class Button extends Component{
    render(){
        const {onClick, children, className=''} = this.props;
        return(
            <button className={className} onClick={onClick}>
                {children}
            </button>

        );
    }
}

export const Loading = () =>
    <div>
        <h2>
            Loading....
        </h2>
    </div>



export const Sort = ({ sortKey, onSort, children, className, activeSortKey}) =>
{
    const sortClass = ['btn default'];
    if(sortKey === activeSortKey){
        sortClass.push('btn btn-primary');
    }
    return(
        <Button className = {sortClass.join(' ') } onClick={() => onSort(sortKey)}>
            {children}
        </Button>
    )

}


Button.propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node,
}

