import React, { Component } from 'react';
import {Grid, Row, FormGroup} from 'react-bootstrap';
// import './App.css';
import list from './List.js';
import './styles/styles.css';

//default params to fetch data from api
const PATH_BASE = 'http://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const DEFAULT_QUERY = 'react';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);




// filter the results by search
function isSearched(searchValue){
    return function (item) {
        return !searchValue || item.title.toLowerCase().includes(searchValue.toLowerCase());

    }
}


class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            result: {},
            searchValue: DEFAULT_QUERY
        }

        this.removeItem = this.removeItem.bind(this);
        this.searchValue = this.searchValue.bind(this);
        this.fetchTopStories = this.fetchTopStories.bind(this);
        this.setTopStories = this.setTopStories.bind(this);
    }

    setTopStories(result){
        console.log("u are in setTop");
        this.setState({
            result: result
        });
        console.log(this.state.result);
    }

//fetch data i.e stories using fetch()
    fetchTopStories(searchValue)
    {
        console.log("u are in fecth top");
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`).then(response => response.json())
            .then(result => this.setTopStories(result))
            .catch(errors => errors);

    }

    componentDidMount(){
        this.fetchTopStories(this.state.searchValue);
    }

    searchValue(event){
        console.log("Search Value");
        this.setState({
            searchValue: event.target.value
        })
    }


    removeItem(id){

        console.log("Remove Item");
        const isNotId = item => item.id !==id;
        const updatedList = this.state.list.filter(isNotId);
        this.setState({
            list: updatedList
        })
        // e.preventDefault();
    }

    render() {
        // console.log(this);
        const {result, searchValue} = this.state;
        console.log("result",result);
        return (

            <div className="App">

                <Grid fluid>
                    <Row>
                        <div className="jumbotron text-center">
                            <Search onChange={ this.searchValue} value={searchValue}>NEWS APP </Search>
                        </div>
                    </Row>
                </Grid>


                <Table result={result} searchValue={searchValue} removeItem={this.removeItem}/>


            </div>
        );
    }
}

class Search extends Component{
    render(){
        const {onChange, value, children} = this.props;
        return (
            <form>
                <FormGroup>
                    <h1 style={{fontWeight: 'bold'}}>{children}</h1><hr style={{border: '2px solid black', width:'100px'}}/>
                    <div className="input-group">
                        <input className="form-control width100 searchForm" type="text" onChange={onChange} value={value}/>
                        <span className="input-group-btn">
                            <button className="btn btn-primary searchBtn" type="submit">
                                Search
                            </button>
                        </span>
                    </div>
                </FormGroup>
            </form>
        );
    }
}

class Table extends Component{
    render(){
        const {result, searchValue, removeItem} = this.props;
        const list = (result.hits) ? result.hits : [];
        return(
            <div className="col-sm-10 col-sm-offset-1">
                {
                    list.filter(isSearched(searchValue)).map( (list,index) =>
                        <div key={index}>
                            <h3> {list.title} </h3>
                            <h4> {list.author} | Comments: {list.comments} | Points: {list.points}
                                <Button className="btn btn-danger btn-xs" type="text" onClick={() => removeItem(list.id)}>Remove </Button>
                            </h4>
                            <hr/>
                        </div>

                    )

                }
            </div>
        );
    }
}

class Button extends Component{
    render(){
        const {onClick, children, className=''} = this.props;
        return(
            <button className={className} onClick={onClick}>
                {children}
            </button>

        );
    }
}
export default App;
