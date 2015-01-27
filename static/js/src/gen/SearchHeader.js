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

        render: function () {
            return (
                React.createElement("div", {className: "input-group"}, 
                  React.createElement("input", {
                    onChange: this.search, 
                    ref: "value", 
                    type: "text", 
                    className: "form-control", 
                    placeholder: "Filter by beer or brewery.."}), 
                  React.createElement("span", {className: "input-group-btn"}, 
                    React.createElement("button", {className: "btn btn-default", type: "button"}, 
                        React.createElement("span", {className: "glyphicon glyphicon-search", "aria-hidden": "true"})
                    )
                  )
                )   
            );
        }
    });

}(Cellar));
