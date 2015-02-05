var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    ns.BottleList = React.createClass({displayName: "BottleList",      
        render: function() {
            var bottleNodes = _.chain(this.props.bottles)
                .filter(function (bottle) {
                    return !bottle.hidden;
                })
                .map(function (bottle) {
                    return (
                        React.createElement(ns.BottleElement, {bottle: bottle, key: bottle.id})
                    );
                })
                .value();

            return (
                React.createElement("tbody", null, bottleNodes)
            );
        }
    });  
}(Cellar));
