

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

var Autocomplete = React.createClass({displayName: "Autocomplete",

    getInitialState: function() {
        return {searchVal: ''};
    },

    search: function () {
        var val = this.refs.value.getDOMNode().value;
        if (val !== this.state.searchVal && val !== '') {
            this.setState({searchVal: val});
            console.log(this.props.url)
            $.ajax({
                url: this.props.url,
                data: {q: val},
                success: this.showResults,
                dataType: 'json'
            });
        }
    },

    showResults: function (results) {
        console.log(results);
    },

    render: function () {
        console.log(this.state.value);
        return (
            React.createElement("input", {
                type: "text", 
                placeholder: this.props.placeholder, 
                ref: "value", 
                className: "form-control", 
                onKeyUp: this.search})
        );
    }
});

var BeerCreator = React.createClass({displayName: "BeerCreator",

    getInitialState: function() {
        return {showCreate: true};
    },

    show: function () {
        this.setState({showCreate: true});
    },

    render: function () {
        if (this.state.showCreate) {
            return (
                React.createElement("tr", null, 
                    React.createElement("td", null, 
                        React.createElement(Autocomplete, {placeholder: "Brewery", url: "/search/brewery"})
                      ), 
                      React.createElement("td", null, 
                        React.createElement("input", {type: "text", className: "form-control"}), 
                        React.createElement("ul", {id: "results"})
                      ), 
                      React.createElement("td", null, 
                        React.createElement("input", {type: "text", className: "form-control"})
                      ), 
                      React.createElement("td", null, 
                        React.createElement("input", {type: "date", className: "form-control"})
                      ), 
                      React.createElement("td", null, 
                        React.createElement("input", {type: "date", className: "form-control"})
                      ), 
                      React.createElement("td", null, 
                        React.createElement("input", {type: "date", className: "form-control"})
                      ), 
                      React.createElement("td", null, 
                        React.createElement("input", {type: "date", className: "form-control"})
                      ), 
                      React.createElement("td", null, 
                        React.createElement("input", {type: "date", className: "form-control"})
                      )
                )
            );
        } else {
            return (
                React.createElement("tr", {colspan: "8"}, 
                    React.createElement("td", null, 
                        React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.show}, 
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