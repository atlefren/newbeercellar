var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

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
                        React.createElement(TableHeader, null), 
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