

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

/*
<div class="dropdown">
                <div class="input-append">
                    <input type="text" placeholder="Skriv navn på lokale" class="typeahead">
                    <button type="button" class="btn"><i class="icon-search"></i></button>
                </div>
                <ul class="dropdown-menu" style="display: block;"><li><a href="/facilities/63" tabindex="-1">Bispehaugen skole gymsal</a></li><li><a href="/facilities/264" tabindex="-1">Brannhaugen barnehage hjerterommet</a></li><li><a href="/facilities/184" tabindex="-1">Byneshallen</a></li><li><a href="/facilities/73" tabindex="-1">Charlottenlund barneskole Chafeen</a></li><li><a href="/facilities/72" tabindex="-1">Charlottenlund barneskole gymsal - lillegymmen</a></li><li><a href="/facilities/71" tabindex="-1">Charlottenlund barneskole musikkrom</a></li><li><a href="/facilities/74" tabindex="-1">Charlottenlund barneskole møterom personalrom</a></li><li><a href="/facilities/274" tabindex="-1">Charlottenlund barneskole SFO-base</a></li><li><a href="/facilities/75" tabindex="-1">Charlottenlund barneskole sløydrom</a></li><li><a href="/facilities/246" tabindex="-1">Flatåsen skole øvre bygg Glasshuset</a></li><li><a href="/facilities/84" tabindex="-1">Hallset skole gymsal</a></li><li><a href="/facilities/31" tabindex="-1">Havstein helse- og velferdssenter festsal</a></li><li><a href="/facilities/33" tabindex="-1">Havstein helse- og velferdssenter svømmebasseng</a></li><li><a href="/facilities/86" tabindex="-1">Hoeggen skole gymsal</a></li><li><a href="/facilities/268" tabindex="-1">Huseby skole Kantine</a></li><li><a href="/facilities/269" tabindex="-1">Huseby skole Kunst og håndverksrom</a></li><li><a href="/facilities/89" tabindex="-1">Hårstad skole gymsal</a></li><li><a href="/facilities/90" tabindex="-1">Hårstad skole hall og personalrom</a></li><li><a href="/facilities/88" tabindex="-1">Hårstad skole, skolekjøkken</a></li><li><a href="/facilities/150" tabindex="-1">Strindheim skole gymsal</a></li></ul>
            </div>
*/


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
        console.log(this.props.extraParams);
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
        console.log(brewery);
        this.setState({breweryId: brewery.id});
    },

    selectBeer: function (beer) {
        console.log(beer);
        this.setState({beerId: beer.id});
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
        
            if (this.state.beerId && this.state.breweryId) {
                return (
                    React.createElement("tbody", null, 
                        searchRow
                    )
                );    
            }
            return (React.createElement("tbody", null, searchRow));

            
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