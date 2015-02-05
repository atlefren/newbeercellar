var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';
    ns.BottleTools = React.createClass({displayName: "BottleTools",

        edit: function (e) {
            e.preventDefault();
            this.props.editBottle(this.props.bottleId);
        },

        remove: function (e) {
            e.preventDefault();
            this.props.removeBottle(this.props.bottleId);
        },

        render: function () {
            return (
                React.createElement("td", {className: "td-3"}, 
                    React.createElement("a", {className: "table-tool", href: "", title: "Edit", onClick: this.edit}, 
                        React.createElement("span", {className: "glyphicon glyphicon-edit"})
                    ), 
                    React.createElement("a", {className: "table-tool", href: "", title: "Remove", onClick: this.remove}, 
                        React.createElement("span", {className: "glyphicon glyphicon-remove-circle"})
                    )
                )
            );
        }
    });
}(Cellar));
