/*global React: false */

var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    ns.BottleList = React.createClass({displayName: "BottleList",

        render: function () {
            var bottleNodes = _.chain(this.props.bottles)
                .filter(function (bottle) {
                    return !bottle.hidden;
                })
                .map(function (bottle) {
                    return (
                        React.createElement(ns.BottleElement, {
                            isEditable: this.props.isEditable, 
                            bottleRemoved: this.props.bottleRemoved, 
                            bottle: bottle, 
                            bottleEdited: this.props.bottleEdited, 
                            key: bottle.id})
                    );
                }, this)
                .value();

            return (
                React.createElement("tbody", null, bottleNodes)
            );
        }
    });
}(Cellar));
