/*global React: false */

var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    ns.SaveBtn = React.createClass({displayName: "SaveBtn",

        save: function (e) {
            e.preventDefault();
            this.props.saveBottle();
        },

        render: function () {
            return (
                React.createElement("td", {className: "td-3"}, 
                    React.createElement("a", {className: "table-tool", href: "", title: "Save", onClick: this.save}, 
                        React.createElement("span", {className: "glyphicon glyphicon-floppy-disk"})
                    )
                )
            );
        }
    });

}(Cellar));
