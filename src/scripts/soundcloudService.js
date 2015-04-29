$( document ).ready(function() {
  var clintId="d652006c469530a4a7d6184b18e16c81",
      baseUrl="https://api.soundcloud.com/tracks";

      function Search (opt) {
        if(opt.query){
        }
      }
});

var SoundcloudSearch = React.createClass({
  getInitialState: function() {
    return {
      url: baseUrl+"?clint_id="+clintId+"&q="
    };
  },

  searchText: function() {
    this.props.onSearchText(
      this.refs.searchInput.getDOMNode().value
    );
  },

  render: function() {
    return (
      <div class="input-group">
          <input type="text" ref="searchInput" class="form-control" value={this.prop.term} placeholder="Filter Songs" />
          <span class="input-group-btn">
          <button class="btn btn-success" onClick={this.searchText} type="button">Go!</button>
      </span>
      </div>
    );
  }
});


var SearchResults = React.createClass({
  getInitialState: function() {
    return {
      term: '',
      url: baseUrl+"?clint_id="+clintId+"&q="
    };
  },

  onClick: function() {
    // this.setState({term: term});
    // var query = this.state.url+this.state.term;
    // $.get(query, function(result) {
    //   if (this.isMounted()) {
    //     console.log(result);
    //   }
    // }.bind(this));
  },

  render: function() {
      return ( 
        <div className="list-group" style="padding-top:15px;">
            <a href="" className="list-group-item list-group-item-warning">Cras justo odio</a>
            <a href="" className="list-group-item list-group-item-warning">Dapibus ac facilisis in</a>
            <a href="" className="list-group-item list-group-item-warning">Morbi leo risus</a>
            <a href="" className="list-group-item list-group-item-warning">Porta ac consectetur ac</a>
            <a href="" className="list-group-item list-group-item-warning">Morbi leo risus</a>
            <a href="" className="list-group-item list-group-item-warning">Vestibulum at eros</a>
        </div>
      );
  }

});

var searchBox = React.createClass({
  getInitialState: function() {
    return {
      term: '1'
    };
  },
  searchText: function(term){
    var query = this.state.url+this.prop.term;
    $.get(query, function(result) {
      if (this.isMounted()) {
        console.log(result);
      }
    }.bind(this));
  },
  render: function() {
    return (
      <div className="box bg-success" style="height: 500px; padding: 15px;position: relative;">
          <SoundcloudSearch onSearchText={this.searchText} term={this.state.term} />
          <SearchResults />

          <div className="box-footer" style="position: absolute;left: 0;bottom: 0;width: 100%;">
            <div style="padding-left: 15px;padding-right: 15px;">
                <a href=""><i className="fa fa-long-arrow-right" style="font-size: 30px;"></i></a>
                <div className="pull-right" style="line-height: 30px;">
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
  <searchBox/>,
  document.getElementById('test')
);