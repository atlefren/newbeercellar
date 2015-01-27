var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

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
                    React.createElement("table", {className: "table"}, 
                        React.createElement(ns.TableHeader, {sortBy: this.sortBy}), 
                        React.createElement(ns.BottleList, {bottles: this.state.bottles})
                    ), 
                    creator, 
                    React.createElement("button", {
                        type: "button", 
                        className: addClass, 
                        onClick: this.toggleCreate}, "Add Bottle")
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