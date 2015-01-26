

var Beer = React.createClass({

});


var BeerList = React.createClass({displayName: "BeerList",
  render: function() {
    return (
      React.createElement("tr", null, React.createElement("td", null, "test"))
    );
  }
});


function createList(beers) {
    React.render(
      React.createElement(BeerList, {beers: beers}),
      document.getElementById('beer_list')
    );
}