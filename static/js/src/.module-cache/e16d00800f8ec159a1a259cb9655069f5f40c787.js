

var Beer = Reactc.createClass({
    render: function () {
        return (React.createElement("tr", null, React.createElement("td", null, "test")));
    }
});


var BeerList = React.createClass({displayName: "BeerList",
  render: function() {
    var beerNodes = this.props.beers.map(function (beer) {
        return (
            React.createElement(Beer, {beer: beer})
        );
    });
    return (
        {beerNodes}
    );
  }
});


function createList(beers) {
    React.render(
      React.createElement(BeerList, {beers: beers}),
      document.getElementById('beer_list')
    );
}