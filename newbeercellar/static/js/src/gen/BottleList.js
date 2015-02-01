var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    function formatDate(date) {
        if (date) {
            return moment(date).format('DD.MM.YYYY');    
        }
        return '';        
    }

    var BottleTools = React.createClass({displayName: "BottleTools",

        edit: function (e) {
            e.preventDefault();
            console.log("edit");
            this.props.editBottle(this.props.bottleId);
        },

        remove: function (e) {
            e.preventDefault();
            console.log("remove");
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

    function wrapRatebeerLink(text, bottle) {
        return (React.createElement("a", {href: bottle.ratebeerUrl}, text));
    }
    
    var Bottle = React.createClass({displayName: "Bottle",

        getInitialState: function () {
            return {showEdit: false};
        },

        editBottle: function (bottleId) {
            console.log("edit!");
            this.setState({showEdit: true});
        },

        removeBottle: function (bottleId) {
        },

        createDisplayCell: function (element) {
            var text = this.props.bottle[element.property];
            if (element.wrap) {
                text = element.wrap(text, this.props.bottle);
            }
            return (
                React.createElement("td", {
                    className: element.className, 
                    key: element.property}, 
                    text
                )
            );
        },

        createEditCell: function (element) {
            if (!element.editable) {
                return this.createDisplayCell(element);
            }
            var text = this.props.bottle[element.property];
            return (
                React.createElement("td", {
                    className: element.className, 
                    key: element.property}, 
                    React.createElement("input", {className: "form-control", value: text})
                )
            );
        },

        render: function () {
            var elements = [
                {property: 'breweryName', className: 'td-20', editable: false},
                {property: 'beerName', className: 'td-20', wrap: wrapRatebeerLink, editable: false},
                {property: 'batchNo', className: 'td-10', editable: true},
                {property: 'brewDate', className: 'td-10', wrap: formatDate, editable: true},
                {property: 'bbfDate', className: 'td-10', wrap: formatDate, editable: true},
                {property: 'size', className: 'td-5', editable: true},
                {property: 'amount', className: 'td-5', editable: true},
                {property: 'comment', className: 'td-17', editable: true}
            ];
            var elementNodes = [];
            if (!this.state.showEdit) {
                elementNodes = _.map(elements, this.createDisplayCell , this)
                elementNodes.unshift(
                    React.createElement(BottleTools, {editBottle: this.editBottle, key: "edit"})
                );
            } else {
                elementNodes = _.map(elements, this.createEditCell , this)
                elementNodes.unshift(React.createElement("td", {className: "td-3"}, "s"));
            }
            return (React.createElement("tr", null, elementNodes));
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
