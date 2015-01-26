var TableHeader = React.createClass({displayName: "TableHeader",

    render: function () {
        return (React.createElement("thead", null, 
          React.createElement("tr", null, 
            React.createElement("th", null, "Brewery"), 
            React.createElement("th", null, "Beer"), 
            React.createElement("th", null, "Batch #"), 
            React.createElement("th", null, "Brew date"), 
            React.createElement("th", null, "Best before date"), 
            React.createElement("th", null, "Size"), 
            React.createElement("th", null, "Amount"), 
            React.createElement("th", null, "Comment")
          )
        ));
    }
});

var BeerTable = React.createClass({displayName: "BeerTable",

    getInitialState: function () {
        return {beers: _.clone(this.props.beers), showCreate: false};
    },

    beerAdded: function (beer) {
        this.setState({
            beers: this.state.beers.concat([beer]),
            showCreate: false
        });
    },

    cancelAdd: function () {
        this.setState({showCreate: false});
    },

    toggleCreate: function () {
        this.setState({showCreate: true});
    },

    render: function () {
        var creator = null;
        if (this.state.showCreate) {
            creator = React.createElement(BeerCreator, {
                        cellarId: this.props.cellarId, 
                        beerAdded: this.beerAdded, 
                        cancelAdd: this.cancelAdd});
        }   
        return (
            React.createElement("div", null, 
                React.createElement("table", {className: "table"}, 
                    React.createElement(TableHeader, null), 
                    React.createElement(BottleList, {bottles: this.state.beers})
                ), 
                creator, 
                React.createElement("button", {
                    type: "button", 
                    className: "btn btn-primary", 
                    onClick: this.toggleCreate}, "Add Bottle")
            )
        );  
    }
});

function createList(cellarId, beers) {
    React.render(
      React.createElement(BeerTable, {beers: beers, cellarId: cellarId}),
      document.getElementById('beer_table')
    );
}