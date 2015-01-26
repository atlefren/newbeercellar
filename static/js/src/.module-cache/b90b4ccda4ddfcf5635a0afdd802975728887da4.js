

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
  
    addBeer: function (beer) {
        console.log(this);
        this.replaceState({beers: []});
    },

    getInitialState: function () {
        return {beers: _.clone(this.props.beers)};
    },


    render: function() {
      var beerNodes = this.state.beers.map(function (beer) {
          return (
              React.createElement(Beer, {beer: beer})
          );
      });
      return (
          React.createElement("tbody", null, beerNodes)
          
      );
    }
});

var AutocompleteItem = React.createClass({displayName: "AutocompleteItem",

    select: function (e) {
        e.preventDefault();
        this.props.selectItem(this.props.item);
        return false;
    },

    render: function () {
        return (
            React.createElement("li", null, 
                React.createElement("a", {href: "/#", tabindex: "-1", onClick: this.select}, 
                    this.props.item.name
                )
            )
        ); 
    }
});

var Autocomplete = React.createClass({displayName: "Autocomplete",

    getInitialState: function() {
        return {searchVal: '', results: [], selectedItem: null};
    },

    search: function () {
        var val = this.refs.input.getDOMNode().value;
        
        if (val !== this.state.searchVal && val !== '') {
            this.setState({searchVal: val});
            $.ajax({
                url: this.props.url,
                data: _.extend({q: val}, this.props.extraParams),
                success: this.showResults,
                dataType: 'json'
            });
        }
        this.setState({selectedItem: null});
        this.setState({searchVal: val});
    },

    showResults: function (results) {
        this.setState({results: results});
    },

    selectItem: function (item) {
        this.setState({searchVal: item.name});
        this.setState({selectedItem: item});
        this.props.select(item);
    },

    input: React.createClass({displayName: "input",
        render: function () {
            return (
                React.createElement("input", {
                    value: this.props.value, 
                    type: "text", 
                    placeholder: this.props.placeholder, 
                    ref: "value", 
                    className: "form-control", 
                    onChange: this.props.search})
            );
        }
    }),

    render: function () {
        var style = {display: "block"};
        var itemNodes = [];
        if (!this.state.results.length || this.state.selectedItem !== null) {
            style = {display: "none"};
        } else {
            itemNodes = this.state.results.map(function (item) {
                return (
                    React.createElement(AutocompleteItem, {item: item, selectItem: this.selectItem})
                );
            }, this);    
        }
        return (
            React.createElement("div", {className: "dropdown"}, 
                React.createElement(this.input, {
                    ref: "input", 
                    value: this.state.searchVal, 
                    search: this.search, 
                    placeholder: this.props.placeholder}), 
                React.createElement("ul", {className: "dropdown-menu", style: style}, 
                    itemNodes
                )
            )
        );
    }
});

var BeerCreator = React.createClass({displayName: "BeerCreator",

    getInitialState: function() {
        return {showCreate: true, beerId: null, breweryId: null};
    },

    show: function () {
        this.setState({showCreate: true});
    },

    selectBrewery: function (brewery) {
        this.setState({breweryId: brewery.id});
    },

    selectBeer: function (beer) {
        this.setState({beerId: beer.id});
    },

    beerAdded: function (beer) {
        console.log(beer);
    },

    save: function () {
        var data = {
             "breweryId": this.state.breweryId,
             "beerId": this.state.beerId,
             "batchNo": this.refs.batch.getDOMNode().value,
             "brewDate": this.refs.brewdate.getDOMNode().value,
             "bbfDate": this.refs.bbfdate.getDOMNode().value,
             "size": this.refs.size.getDOMNode().value,
             "amount": parseInt(this.refs.amount.getDOMNode().value, 10),
             "comment": this.refs.comment.getDOMNode().value
         };

        $.ajax({
            url: "/save",
            type: "POST",
            data: JSON.stringify(data),
            success: this.beerAdded,
            contentType: 'application/json',
            dataType: 'json'
        });
    },

    render: function () {
        if (this.state.showCreate) {
            var beerSearchParams = {brewery: this.state.breweryId};
            var searchRow = (
                React.createElement("tr", null, 
                        React.createElement("td", null, 
                            React.createElement(Autocomplete, {
                                placeholder: "Brewery", 
                                url: "/search/brewery", 
                                select: this.selectBrewery})
                          ), 
                          React.createElement("td", null, 
                            React.createElement(Autocomplete, {
                                placeholder: "Beer", 
                                url: "/search/beer", 
                                extraParams: beerSearchParams, 
                                select: this.selectBeer})
                          ), 
                          React.createElement("td", null, 
                            React.createElement("input", {type: "text", ref: "batch", className: "form-control"})
                          ), 
                          React.createElement("td", null, 
                            React.createElement("input", {type: "date", ref: "brewdate", className: "form-control"})
                          ), 
                          React.createElement("td", null, 
                            React.createElement("input", {type: "date", ref: "bbfdate", className: "form-control"})
                          ), 
                          React.createElement("td", null, 
                            React.createElement("input", {type: "date", ref: "size", className: "form-control"})
                          ), 
                          React.createElement("td", null, 
                            React.createElement("input", {type: "number", defaultValue: "1", ref: "amount", className: "form-control"})
                          ), 
                          React.createElement("td", null, 
                            React.createElement("input", {type: "text", ref: "comment", className: "form-control"})
                          )
                    )
                );
        
            if (this.state.beerId && this.state.breweryId) {
                return (
                    React.createElement("tbody", null, 
                        searchRow, 
                        React.createElement("tr", {colspan: "8"}, 
                            React.createElement("td", null, 
                                React.createElement("button", {type: "button", className: "btn", onClick: this.save}, "Save")
                            )
                        )
                    )
                );    
            }
            return (React.createElement("tbody", null, searchRow, React.createElement("tr", null)));

            
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

    var list = React.render(
      React.createElement(BeerList, {beers: beers}),
      document.getElementById('beer_list')
    );

    list.addBeer({
            "breweryName": "test",
             "beerName": "test",
             "beerId": "59582",
             "batchNo": 202,
             "size": 50,
             "amount": 1
    });

    React.render(
      React.createElement(BeerCreator, null),
      document.getElementById('beer_create')
    );
}