/** @jsx React.DOM */

'use strict';
//add the react module
var React = require('react');

var clientId='d652006c469530a4a7d6184b18e16c81',
    baseUrl='https://api.soundcloud.com/tracks',
    searchResults=[],
    resentSearches=[],
    pagination=0,
    isTile=false;

//create the input and button for the search
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

//populate the list of search items
var SearchResults = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    //check if there are results to populate the page
    var val='';
    if(Object.keys(this.props.results).length !== 0){
      if(isTile){
        val = this.props.results.map(function(result) {
            return <a href={result.id} className="list-group-item list-group-item-danger">{result.title}
                      <img className="img-responsive" src={result.artwork_url}/>
                    </a>;
        });
      }
      else{
        val = this.props.results.map(function(result) {
            return <a href={result.id} className="list-group-item list-group-item-danger">{result.title}</a>;
        });
      }
    }
      return (
        <div>
            {val}
        </div>
      );
  }
});

//create the search container
var SearchBox = React.createClass({
  getInitialState: function() {
    return {
      term: '',
      results:{}
    };
  },
  //make a get all to the api to get the search results
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
  //show the next set of results
  nextPage: function(e) {
      e.preventDefault();
      pagination= pagination+6;
      this.searchText(this.state.term);
  },
  render: function() {
    return (
      <div className="box bg-info">
          <SoundcloudSearch onSearchText={this.searchText} />
          <div className="list-group inputSearchResults">
            <SearchResults results={this.state.results}/>
          </div>

          <div className="box-footer">
            <div>
                <a href=""><i className="fa fa-long-arrow-right nextPage" term={this.state.term} onClick={this.nextPage}></i></a>
                <div className="pull-right">
                  <a href=""><i className="fa fa-list list"></i></a>
                  <a href=""><i className="fa fa-th-large tiles"></i></a>
                </div>
            </div>
          </div>
      </div>
    );
  }
});

//create the image container
var ImageBox = React.createClass({
  getInitialState: function() {
    return {
      image: 'http://placehold.it/300x300',
      audio:'',
      songId:0
    };
  },
  //play the selected song
  playSong: function(){
    if($('.songImg').attr('songid')){
        var audio = document.getElementById('audio');
        audio.play();
        audio.setAttributeNode(document.createAttribute("controls"));
    }
  },
  render: function(){
    return(
        <div className="box bg-info">
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

//create the resent searches container
var HistoryBox = React.createClass({
    getInitialState: function() {
        return {
          results: []
        };
    },
    render: function(){
        return(
            <div className="box bg-info">
              <div className="text-center">Resent Searches</div>
                <div className="list-group historySearchResults">
                </div>
            </div>
        );
    }
});

//render the react objects to the page
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
  //use the selected item from resent searches
  $('#historyBox .historySearchResults').on('click', function(e) {
      e.preventDefault();
      var pos = (e.target).getBoundingClientRect();
      $(e.target).clone().css({'position':'absolute','top':pos.bottom-pos.height,'left':pos.left,'width':pos.width})
              .appendTo('body').stop(true, true).fadeOut({ duration: 400, queue: false }).animate({'left': pos.left-200},600);
      searchAndCreate(resentSearches,e);
  });

  $('#searchBox .inputSearchResults').on('click', function(e) {
      e.preventDefault();
      var pos = (e.target).getBoundingClientRect();
      $(e.target).clone().css({'position':'absolute','top':pos.bottom-pos.height,'left':pos.left,'width':pos.width})
              .appendTo('body').stop(true, true).fadeOut({ duration: 400, queue: false }).animate({'left': pos.left+200},600);
      console.log(e.target);
      var item = searchAndCreate(searchResults,e);

      //check if the item is in resent searches if not add it
      if(!checkDuplicate(resentSearches, item.id)){
            resentSearches.unshift(item);
            if (resentSearches.length > 6) {
              resentSearches.pop();
              $('#historyBox').find('.list-group .list-group-item:last-child').remove();
            }
            $('#historyBox').find('.list-group').prepend('<a href='+item.id+
                                                          ' class="list-group-item list-group-item-danger">'+
                                                          item.title+'</a>');
        }
  });
  $('#searchBox .box-footer .tiles').click(function(e) {
    e.preventDefault();
    console.log(e.target);
    if(!isTile){
      $('#searchBox .list-group-item').each(function(index, value) {
        $(this).addClass('col-xs-6 tileList').append('<img class="img-responsive" src="'+searchResults[index].artwork_url+'"/>');
      });
    }
    isTile=true;
  });
  $('#searchBox .box-footer .list').click(function(e) {
    e.preventDefault();
    if(isTile){
      $('#searchBox .list-group-item').each(function(index, value) {
        $(this).removeClass('col-xs-6 tileList').find('img').remove();
      });
    }
    isTile=false;
  });
});

function checkDuplicate(array, val){
    for (var i = 0; i < array.length; i++) {
        if(array[i].id === val){ return true}
    };
    return false;
}

//build the Sound Cloud api request
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

//find the item data, set the image and audio
function searchAndCreate(array,e) {
  var item =[];
  array.forEach(function(entry) {
    if (entry.id.toString() === $(e.target).attr("href")) {
        $(".songImg").hide();
        if (entry.artwork_url) {
            $(".songImg").attr({
                'src': entry.artwork_url,
                'songId': entry.id
            });
        } else{
            $(".songImg").attr({
                'src': 'http://placehold.it/300x300',
                'songId': entry.id
            });
          }
          $(".songImg").fadeIn(1000);

    $('#audio source:first-child').attr({'src':entry.stream_url+'?client_id='+clientId,'type':'audio/ogg'})
    .next().attr({'src':entry.stream_url+'?client_id='+clientId,'type':'audio/mp3'});
    var audio = document.getElementById('audio');
    audio.load();

    item = entry;
    }
  });
  return item;
}
