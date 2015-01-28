var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';
    ns.SearchHeader = React.createClass({displayName: "SearchHeader",

        getInitialState: function () {
            return {phrase: null};
        },

        search: function () {
            var val = this.refs.value.getDOMNode().value.trim();
            if (val === '') {
                val = null;
            }
            if (val !== this.state.phrase) {
                this.setState({phrase: val});
                this.props.search(val);
            }
        },

        clear: function () {
            this.setState({phrase: null});
            this.props.search(null);
        },

        render: function () {
            var clearClass = "clear-btn pull-right glyphicon glyphicon-remove-circle";
            if (!this.state.phrase) {
                clearClass += " hidden";
            }
            return (
                React.createElement("div", {className: "form-control"}, 
                    React.createElement("span", {className: "glyphicon glyphicon-search"}), 
                    React.createElement("input", {
                    className: "filtersearch", 
                    onChange: this.search, 
                    value: this.state.phrase, 
                    ref: "value", 
                    type: "text", 
                    placeholder: "Filter by beer or brewery.."}), 
                    React.createElement("span", {className: clearClass, onClick: this.clear})
                )

            );
        }
    });

}(Cellar));
