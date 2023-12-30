import React from "react";
import "./Search.css"

function Search({ results }) {

    return (
        <div className="search-results">
            <h1>Search</h1>
            {/*{results.map((result) => (*/}
            {/*    <div key={result.movieId} className="search-result">*/}
            {/*        /!* Display information about each search result *!/*/}
            {/*        <p>{result.title}</p>*/}
            {/*        /!* Add other details as needed *!/*/}
            {/*    </div>*/}
            {/*))}*/}
        </div>
    );
}

export default Search;
