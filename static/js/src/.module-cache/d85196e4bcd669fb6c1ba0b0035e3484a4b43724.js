

var Beer = React.createClass({displayName: "Beer",
    render: function () {
        return (React.createElement("tr", null, React.createElement("td", null, "test")));
    }
});


var BeerList = React.createClass({displayName: "BeerList",
  render: function() {
    console.log(this.props);
    var beerNodes = this.props.beers.map(function (beer) {
        return (
            React.createElement(Beer, {beer: beer})
        );
    });
    console.log(beerNodes);
    return (
        React.createElement("div", null, beerNodes)
        
    );
  }
});


function createList(beers) {
    console.log(beers)
    React.render(
      React.createElement(BeerList, {beers: beers}),
      document.getElementById('beer_list')
    );
}