/*global React: false */

var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    ns.QuickFilter = React.createClass({displayName: "QuickFilter",

        render: function () {
            return (
                React.createElement("select", {className: "form-control"}, 
                    React.createElement("option", {selected: true}, "Quick filter"), 
                    React.createElement("option", null, "2"), 
                    React.createElement("option", null, "3"), 
                    React.createElement("option", null, "4"), 
                    React.createElement("option", null, "5")
                )
            );
        }
    });

}(Cellar));