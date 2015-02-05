var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    var sorts = [null, 'asc', 'desc'];
    
    function getNextSort(key) {
        var i = sorts.indexOf(key) + 1;
        if (i > sorts.length - 1) {
            i = 0;
        }
        return i;      
    };

    var Header = React.createClass({displayName: "Header",

        getInitialState: function () {
            return {sortOrder: sorts[0]};
        },

        click: function () {
            if (this.props.sortType) {
                var sortOrder = sorts[getNextSort(this.state.sortOrder)];
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
                    sortOrder = "▲"
                }
            }
            var className;
            if (this.props.sortType) {
                className ='sortable';
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

            var columns = {
                util: {name: '', sort: null},
                breweryName: {name: "Brewery", sort: "alph"},
                beerName: {name: "Beer", sort: "alph"},
                batchNo: {name: "Batch #", sort: "alph"},
                brewDate: {name: "Brew date", sort: "date"},
                bbfDate: {name: "Best before date", sort: "date"},
                size: {name: "Size", sort: "num"},
                amount: {name: "Amount", sort: "num"},
                comment: {name: "Comment", sort: null}
            };

            var headings = _.map(columns, function (data, key) {
                var sorted = this.state.sortOn === key;
                return (
                    React.createElement(Header, {
                        sorted: sorted, 
                        sortType: data.sort, 
                        text: data.name, 
                        sortBy: this.sortBy, 
                        key2: key, 
                        key: key})
                );
            }, this);

            return (React.createElement("thead", null, 
              React.createElement("tr", null, 
                headings
              )
            ));
        }
    });

}(Cellar));