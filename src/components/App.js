import React, { Component } from 'react';
import {Grid, Row} from 'react-bootstrap';
import '../styles/styles.css';
import {PATH_BASE, PATH_SEARCH, PARAM_SEARCH, DEFAULT_QUERY,DEFAULT_PAGE, PARAM_PAGE , DEFAULT_HPP ,PARAM_HPP} from '../constants/index';
import Table from './Table';
import {Loading, Button} from './Button';
import Search from './Search';


const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
console.log(url);




// filter the results by search
// function isSearched(searchValue){
//     return function (item) {
//         return !searchValue || item.title.toLowerCase().includes(searchValue.toLowerCase());
//
//     }
// }

const withLoading = (Component) => ({ isLoading, ...rest}) =>
    isLoading ? <Loading/> : <Component {...rest}/>

const updateTopStories = (hits, page) =>
    prevState => {
        const {results}= prevState;

        const oldHits = results && results.searchKey ? results.searchKey.hits : [];
        // console.log(results.searchKey);
        console.log(" oldhits", oldHits);
        const updatedHits = [...hits, ...oldHits];
        console.log(updatedHits);

        return {
            results: {
                ...results,
                searchKey: {
                    hits: updatedHits,
                    page
                },
                isLoading: false

            }
        }
    }


class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            results: {},
            searchKey: '',
            // step1: used to store each result. we assign each result a key
            searchValue: DEFAULT_QUERY,
            isLoading: false,
            sortKey: 'NONE',
            isSortReverse: false
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

        // this means if page is 0 then onlcick is not clicked and there isn't any older data
        // const oldHits = page !==0 ? this.state.result.hits : [];
        // step3: redefine old hits
        this.setState(updateTopStories(hits, page) );
    }


    checkTopStories(searchValue){
        return !this.state.results.searchValue;
    }

//fetch data i.e stories using fetch()
    fetchTopStories(searchValue, page)
    {
        this.setState({
            isLoading: true
        })
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
            searchKey: searchValue,
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
        const {results} = this.state;
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
        const {results, searchValue, isLoading} = this.state;
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
                        <Table result={list} removeItem={this.removeItem}/>


                        <div className="text-center alert">
                           <ButtonWithLoading isLoading={isLoading} className="btn btn-success" onClick={() => this.fetchTopStories(searchValue, page+1)}> Load More</ButtonWithLoading>

                        </div>


                    </Row>
                </Grid>

            </div>

        );
    }
}

const ButtonWithLoading = withLoading(Button);

export default App;
