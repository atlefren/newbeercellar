

var Beer = React.createClass({displayName: "Beer",
    render: function () {
        return (
            React.createElement("tr", null, 
                React.createElement("td", null, this.props.beer.breweryName), 
                React.createElement("td", null, this.props.beer.beerName), 
                React.createElement("td", null, this.props.beer.batchNo), 
                React.createElement("td", null, this.props.beer.brewDate), 
                React.createElement("td", null, this.props.beer.bbfDate), 
                React.createElement("td", null, this.props.beer.size), 
                React.createElement("td", null, "test"), 
                React.createElement("td", null, "test")
            )
        );
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
    return (
        React.createElement("tbody", null, beerNodes)
        
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