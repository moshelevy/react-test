/** @jsx React.DOM */

'use strict';

var React = require('react'),
    SearchBox;

// ExampleApp = React.createClass({
//     render: function() {
//         return (
//             /*jshint ignore:start */
//             <div>
//                 <h2>Hello, World</h2>
//             </div>
//             /*jshint ignore:end */
//         );
//     }
// });

// React.render(
//     /*jshint ignore:start */
//     <ExampleApp />,
//     /*jshint ignore:end */
//     document.getElementById('app')
// );

  var clientId='d652006c469530a4a7d6184b18e16c81',
      baseUrl='https://api.soundcloud.com/tracks';

var SoundcloudSearch = React.createClass({
  getInitialState: function() {
    return {};
  },

  searchText: function() {
    this.props.onSearchText(
      this.refs.searchInput.getDOMNode().value
    );
  },

  render: function() {
    return (
      <div className="input-group">
          <input type="text" ref="searchInput" className="form-control"  placeholder="Filter Songs" />
          <span className="input-group-btn">
          <button className="btn btn-success" onClick={this.searchText} type="button">Go</button>
      </span>
      </div>
    );
  }
});

var SearchResults = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
      return ( 
        <div className="list-group">
            {this.props.results.map(function(result) {
              return <a href="" className="list-group-item list-group-item-warning" songId={result.id}>{result.title}</a>;
            })}
        </div>
      );
  }

});

var SearchBox = React.createClass({
  getInitialState: function() {
    return {
      term: '',
      url: baseUrl+'?client_id='+clientId+'&limit=6&q=',
      results:[]
    };
  },
  searchText: function(term){
    var query = this.state.url+term;
    $.get(query, function(result) {
      if (this.isMounted()) {
        this.state.results = result;
        console.log(this.state.results);
      }
    }.bind(this));
  },
  render: function() {
    return (
      <div className="box bg-success">
          <SoundcloudSearch onSearchText={this.searchText} term={this.state.term} />
          <SearchResults results={this.state.results}/>

          <div className="box-footer">
            <div>
                <a href=""><i className="fa fa-long-arrow-right"></i></a>
                <div className="pull-right">
                  <a href=""><i className="fa fa-list"></i></a>
                  <a href=""><i className="fa fa-th-large"></i></a>
                </div>
            </div>
          </div>
      </div>
    );
  }
});

React.render(
  <SearchBox/>,
  document.getElementById('test')
);

