var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    function formatDate(date) {
        if (date) {
            return moment(date).format('DD.MM.YYYY');    
        }
        return '';        
    }
    
    var Bottle = React.createClass({displayName: "Bottle",
        render: function () {
            return (
                React.createElement("tr", null, 
                    React.createElement("td", {className: "td-20"}, 
                        this.props.bottle.breweryName
                    ), 
                    React.createElement("td", {className: "td-20"}, 
                        React.createElement("a", {href: this.props.bottle.ratebeerUrl}, 
                            this.props.bottle.beerName
                        )
                    ), 
                    React.createElement("td", {className: "td-10"}, 
                        this.props.bottle.batchNo
                    ), 
                    React.createElement("td", {className: "td-10"}, 
                        formatDate(this.props.bottle.brewDate)
                    ), 
                    React.createElement("td", {className: "td-10"}, 
                        formatDate(this.props.bottle.bbfDate)
                    ), 
                    React.createElement("td", {className: "td-5"}, 
                        this.props.bottle.size
                    ), 
                    React.createElement("td", {className: "td-5"}, 
                        this.props.bottle.amount
                    ), 
                    React.createElement("td", {className: "td-20"}, 
                        this.props.bottle.comment
                    )
                )
            );
        }
    });


    ns.BottleList = React.createClass({displayName: "BottleList",
      
        render: function() {
            var bottleNodes = _.chain(this.props.bottles)
                .filter(function (bottle) {
                    return !bottle.hidden;
                })
                .map(function (bottle) {
                    return (
                        React.createElement(Bottle, {bottle: bottle, key: bottle.id})
                    );
                })
                .value();

            return (
                React.createElement("tbody", null, bottleNodes)
            );
        }
    });  
}(Cellar));
