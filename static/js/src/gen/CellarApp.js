var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';


    function match(query, attr) {
        return (attr.toLowerCase().indexOf(query) !== -1);
    }


    var Cellar = React.createClass({displayName: "Cellar",

        getInitialState: function () {
            return {bottles: _.clone(this.props.bottles), showCreate: false};
        },

        bottleAdded: function (bottle) {
            this.setState({
                bottles: this.state.bottles.concat([bottle]),
                showCreate: false
            });
        },

        cancelAdd: function () {
            this.setState({showCreate: false});
        },

        toggleCreate: function () {
            this.setState({showCreate: true});
        },

        sortBy: function (key, type, order) {
            var sortFunc = ns.createSort(type, key, order);
            var sorted = this.state.bottles.sort(sortFunc);
            this.setState({
                bottles: sorted
            });
        },

        search: function (query) {
            if (query) {
                query = query.toLowerCase();
            }    
            var filtered = _.map(this.state.bottles, function (bottle) {
                if (!query) {
                    bottle.hidden = false;
                    return bottle;    
                }
                var beerMatch = match(query, bottle.beerName);
                var breweryMatch = match(query, bottle.breweryName);

                var searchHit = beerMatch || breweryMatch;
                bottle.hidden = !searchHit;
                return bottle;
                
            });
            this.setState({bottles: filtered});
        },

        render: function () {
            var creator = null;
            var addClass = "btn btn-primary";
            if (this.state.showCreate) {
                creator = React.createElement(ns.BottleCreator, {
                            cellarId: this.props.cellarId, 
                            bottleAdded: this.bottleAdded, 
                            cancelAdd: this.cancelAdd});
                addClass += ' hidden';                        
            }

            return (
                React.createElement("div", null, 
                    React.createElement("div", {className: "row"}, 
                        React.createElement("div", {className: "col-lg-7"}, 
                            React.createElement("button", {
                                type: "button", 
                                className: addClass, 
                                onClick: this.toggleCreate}, "Add Bottle")
                        ), 
                        React.createElement("div", {className: "col-lg-2"}
                        ), 
                        React.createElement("div", {className: "col-lg-3"}, 
                            React.createElement(ns.SearchHeader, {search: this.search})
                        )
                    ), 
                    creator, 
                    React.createElement("table", {className: "table"}, 
                        React.createElement(ns.TableHeader, {sortBy: this.sortBy}), 
                        React.createElement(ns.BottleList, {bottles: this.state.bottles})
                    )
                )
            );  
        }
    });

    ns.createList = function (cellarId, bottles) {
        React.render(
          React.createElement(Cellar, {bottles: bottles, cellarId: cellarId}),
          document.getElementById('beer_table')
        );
    };

}(Cellar));