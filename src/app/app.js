/** @jsx React.DOM */

'use strict';

var React = require('react');

var clientId='d652006c469530a4a7d6184b18e16c81',
    baseUrl='https://api.soundcloud.com/tracks',
    searchResults=[],
    resentSearches=[],
    pagination=0;

var SoundcloudSearch = React.createClass({
  getInitialState: function() {
    return {};
  },
  searchText: function() {
    pagination = 0;
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

    var val='';
    if(Object.keys(this.props.results).length !== 0){
    val = this.props.results.map(function(result) {
            return <a href={result.id} className="list-group-item list-group-item-warning">{result.title}</a>;
        });
    }
      return ( 
        <div className="list-group">
            {val}
        </div>
      );
  }
});

var SearchBox = React.createClass({
  getInitialState: function() {
    return {
      term: '',
      results:{}
    };
  },
  searchText: function(term){
    this.state.term = term;
    var query = soundcloudUrl(baseUrl,clientId,term,6,pagination);
    $.get(query, function(result) {
      if (this.isMounted()) {
        this.setState({results:result})
        searchResults = result;
      }
    }.bind(this));
  },
  nextPage: function() {
      pagination= pagination+6;
      this.searchText(this.state.term);
  },
  render: function() {
    return (
      <div className="box bg-success">
          <SoundcloudSearch onSearchText={this.searchText} />
          <SearchResults results={this.state.results}/>

          <div className="box-footer">
            <div>
                <a href=""><i className="fa fa-long-arrow-right nextPage" term={this.state.term} onClick={this.nextPage}></i></a>
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

var ImageBox = React.createClass({
  getInitialState: function() {
    return {
      image: 'http://placehold.it/300x300',
      audio:'',
      songId:0
    };
  },
  playSong: function(){
    if($('.songImg').attr('songid')){
        var audio = document.getElementById('audio');
        audio.load();
        audio.play();
        audio.setAttributeNode(document.createAttribute("controls")); 
    }
  },
  render: function(){
    return(
        <div className="box bg-success">
            <img className="songImg img-responsive" width="300px" songid={this.state.songId} src={this.state.image} onClick={this.playSong} /> 
            <audio id="audio">
              <source src="https://api.soundcloud.com/tracks/72428264/stream?client_id=d652006c469530a4a7d6184b18e16c81" type="audio/ogg"/>
              <source src="https://api.soundcloud.com/tracks/72428264/stream?client_id=d652006c469530a4a7d6184b18e16c81" type="audio/mpeg"/>
                Your browser does not support the audio element.
            </audio>
        </div>
        );
  }
});

var HistoryBox = React.createClass({
    getInitialState: function() {
        return {
          results: []
        };
    },
    render: function(){
        return(
            <div className="box bg-success">
              <div className="text-center">Resent Searches</div>
                <SearchResults results={this.state.results}/>          
            </div>
        );
    }
});

React.render(
  <SearchBox/>,
  document.getElementById('searchBox')
);
React.render(
  <ImageBox/>,
  document.getElementById('imageBox')
);
React.render(
  <HistoryBox/>,
  document.getElementById('historyBox')
);

$(document).ready(function() {
    $('#searchBox, #historyBox').on('click', function(e) {
        if ($(e.target).is('a.list-group-item')) {
            e.preventDefault();
            searchResults.forEach(function(entry) {
                if (entry.id.toString() === $(e.target).attr("href")) {
                    if (entry.artwork_url) {
                        $(".songImg").attr({
                            'src': entry.artwork_url,
                            'songId': entry.id
                        });
                    } else
                        $(".songImg").attr({
                            'src': 'http://placehold.it/300x300',
                            'songId': entry.id
                        });

                $('#audio source:first-child').attr({'src':entry.stream_url+'?client_id='+clientId,'type':'audio/ogg'})
                .next().attr({'src':entry.stream_url+'?client_id='+clientId,'type':'audio/mp3'});
                }
            });
        }
    });

  $('#searchBox').on('click', function(e) {
      if ($(e.target).is('a.list-group-item')) {
        if(!checkDuplicate(resentSearches,$(e.target).attr('href'))){
              resentSearches.unshift({'id':$(e.target).attr('href'),'title':$(e.target).text()});
              if (resentSearches.length > 6) {
                resentSearches.pop();
                $('#historyBox').find('.list-group .list-group-item:last-child').remove();
              }
              $('#historyBox').find('.list-group').prepend('<a href='+$(e.target).attr('href')+
                                                            ' class="list-group-item list-group-item-warning">'+
                                                            $(e.target).text()+'</a>');
              console.log(resentSearches.length);
          }
      }
  });

  $('.nextPage').click(function(e){
    e.preventDefault();
  });
});

function checkDuplicate(array, val){
    for (var i = 0; i < array.length; i++) {
        if(array[i].id === val){ return true}
    };
    return false;
}
function soundcloudUrl(base,id,q,limit,offset){
    var tempUrl=base+'?client_id='+id;
    if(q){
        tempUrl+='&q='+q;
    }
    if(limit){
        tempUrl+='&limit='+limit;
    }
    if(offset){
        if(offset !== 0){
            tempUrl+='&offset='+offset;
        }
    }
    return tempUrl;
}