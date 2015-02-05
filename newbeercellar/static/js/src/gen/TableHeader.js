/*global React: false */

var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    function createToggler(list) {
        return function (key) {
            var i = list.indexOf(key) + 1;
            if (i > list.length - 1) {
                i = 0;
            }
            return list[i];
        };
    }


    var getNextSort = createToggler([null, 'asc', 'desc']);


    var Header = React.createClass({displayName: "Header",

        getInitialState: function () {
            return {sortOrder: null};
        },

        click: function () {
            if (this.props.sortType) {
                var sortOrder = getNextSort(this.state.sortOrder);
                this.setState({sortOrder: sortOrder});
                this.props.sortBy(this.props.key2, this.props.sortType, sortOrder);
            }
        },

        render: function () {
            var sortOrder = null;
            if (this.props.sorted) {
                if (this.state.sortOrder === 'desc') {
                    sortOrder = "▼";
                } else if (this.state.sortOrder === 'asc') {
                    sortOrder = "▲";
                }
            }
            var className = this.props.className;
            if (this.props.sortType) {
                className += ' sortable';
            }
            return (
                React.createElement("th", {
                    className: className, 
                    onClick: this.click}, this.props.text, " ", sortOrder)
            );
        }
    });


    ns.TableHeader = React.createClass({displayName: "TableHeader",

        getInitialState: function () {
            return {sortOn: null};
        },

        sortBy: function (key, type, order) {
            this.setState({sortOn: key});
            this.props.sortBy(key, type, order);
        },

        render: function () {
            var elements = _.clone(ns.listElements);
            elements.unshift({
                property: 'util',
                name: '',
                sort: null,
                className: 'td-3'
            });
            var headings = _.map(elements, function (data) {
                var key = data.property;
                var sorted = this.state.sortOn === key;
                return (
                    React.createElement(Header, {
                        className: data.className, 
                        sorted: sorted, 
                        sortType: data.sort, 
                        text: data.name, 
                        sortBy: this.sortBy, 
                        key2: key, 
                        key: key})
                );
            }, this);

            return (
                React.createElement("thead", null, 
                    React.createElement("tr", null, 
                        headings
                    )
                )
            );
        }
    });

}(Cellar));