

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
                React.createElement("td", null, this.props.beer.amount), 
                React.createElement("td", null, this.props.beer.comment)
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

var BeerCreator = React.createClass({displayName: "BeerCreator",

    getInitialState: function() {
        return {showCreate: false};
    },

    render: function () {
        if (this.state.showCreate) {
            return (React.createElement("tr", {colspan: "8"}, React.createElement("td", null, "test")));
        } else {
            return (
                React.createElement("tr", {colspan: "8"}, 
                    React.createElement("td", null, 
                        React.createElement("button", {type: "button", className: "btn btn-primary"}, 
                            "Add Beer"
                        )
                    )
                )
            );
        }
    }
});


function createList(beers) {
    React.render(
      React.createElement(BeerList, {beers: beers}),
      document.getElementById('beer_list')
    );

    React.render(
      React.createElement(BeerCreator, null),
      document.getElementById('beer_create')
    );
}