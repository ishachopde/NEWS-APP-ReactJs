import React, { Component } from 'react';
import {Grid, Row, FormGroup} from 'react-bootstrap';
// import './App.css';
import list from './List.js';
import './styles/styles.css';
import {PATH_BASE, PATH_SEARCH, PARAM_SEARCH, DEFAULT_QUERY,DEFAULT_PAGE, PARAM_PAGE , DEFAULT_HPP ,PARAM_HPP} from './constants/index';



const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
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
            results: {},
            searchKey: '',
            // step1: used to store each result. we assign each result a key
            searchValue: DEFAULT_QUERY
        }
        console.log("results from state", this.state.results);
        this.removeItem = this.removeItem.bind(this);
        this.searchValue = this.searchValue.bind(this);
        this.fetchTopStories = this.fetchTopStories.bind(this);
        this.setTopStories = this.setTopStories.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    setTopStories(result){
        console.log("u are in setTop");
        const {hits, page} = result;
        const {results, searchKey}= this.state;
        console.log("results", results);
        // this means if page is 0 then onlcick is not clicked and there isn't any older data
        // const oldHits = page !==0 ? this.state.result.hits : [];
        // step3: redefine old hits
        const oldHits = results && results.searchKey ? results.searchKey.hits : [];
        // console.log(results.searchKey);
        console.log(" oldhits", oldHits);
        const updatedHits = [...hits, ...oldHits];
        console.log(updatedHits);

        this.setState({
            results: {
                ...results,
                searchKey: {
                    hits: updatedHits,
                    page
                }

            }
        });
        console.log("results", results);
    }

    checkTopStories(searchValue){
        return !this.state.results.searchValue;
    }

//fetch data i.e stories using fetch()
    fetchTopStories(searchValue, page)
    {
        console.log("u are in fecth top");
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchValue}
        &${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(response => response.json())
            .then(result => this.setTopStories(result))
            .catch(errors => errors);

    }

    componentDidMount(){
        //step2: set searchkey before each search request is sent
        const {searchValue} = this.state;
        this.setState({
            searchKey: searchValue
        });
        this.fetchTopStories(searchValue, DEFAULT_PAGE);
    }


    // onsubmit search function
    onSubmit(e){
        // console.log("submit");
        const {searchValue} = this.state;
        this.setState({
            searchKey: searchValue
        });

        if(this.checkTopStories(searchValue)){
            this.fetchTopStories(searchValue, DEFAULT_PAGE);
        }
        e.preventDefault();
    }

    searchValue(event){
        console.log("Search Value",this.state.searchValue);
        this.setState({
            searchValue: event.target.value
        })
    }


    removeItem(id){
        const {results, searchKey} = this.state;
        const{hits,page}= results.searchKey;
        console.log("Remove Item");
        const isNotId = item => item.objectID !==id;
        // console.log(item.id);
        const updatedList = hits.filter(isNotId);
        this.setState({
            results: {
                ...results,
                searchKey: {
                    hits: updatedList,
                    page
                }

            }

        });
    }

    render() {
        // console.log(this);
        const {results, searchValue, searchKey} = this.state;
        console.log("results",results);
        const page = (results && results.searchKey && results.searchKey.page ) || 0;
        console.log("page",page);
        // step4:
        const list = (results && results.searchKey && results.searchKey.hits) || [];
        console.log("log",list);
        return (

            <div className="App">

                <Grid fluid>
                    <Row>
                        <div className="jumbotron text-center">
                            <Search onChange={ this.searchValue} value={searchValue} onSubmit = {this.onSubmit}>NEWS APP </Search>
                        </div>
                    </Row>
                </Grid>

                <Grid>
                    <Row>
                        {/*if the result has some data then  show the table else null*/}
                        <Table result={list} searchValue={searchValue} removeItem={this.removeItem}/>


                        <div className="text-center alert">
                            <Button className="btn btn-success" onClick={() => this.fetchTopStories(searchValue, page+1)}> Load More</Button>
                        </div>


                    </Row>
                </Grid>

            </div>

        );
    }
}

class Search extends Component{
    render(){
        const {onChange, value, children, onSubmit} = this.props;
        return (
            <form  onClick={onSubmit}>
                <FormGroup>
                    <h1 style={{fontWeight: 'bold'}}>{children}</h1><hr style={{border: '2px solid black', width:'100px'}}/>
                    <div className="input-group">
                        <input className="form-control width100 searchForm" type="text"  onChange={onChange} value={value}/>
                        <span className="input-group-btn">
                            <Button className="btn btn-primary searchBtn" type="submit">
                                Search
                            </Button>
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
        // console.log(result.searchKey);
        const list = (result) ? result : [];
        console.log("list",list);
        return(
            <div className="col-sm-10 col-sm-offset-1">
                {
                    // list.filter(isSearched(searchValue)).map( (hit,index) =>
                    list.map( (hit,index) =>
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
