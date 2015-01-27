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
            var clearClass = "clear-btn right-addon glyphicon glyphicon-remove-circle";
            if (!this.state.phrase) {
                clearClass += " hidden";    
            }
            return (
                React.createElement("div", {className: "inner-addon left-addon right-addon"}, 
                    React.createElement("span", {className: "left-addon glyphicon glyphicon-search"}), 
                    React.createElement("input", {
                    onChange: this.search, 
                    value: this.state.phrase, 
                    ref: "value", 
                    type: "text", 
                    className: "form-control", 
                    placeholder: "Filter by beer or brewery.."}), 
                    React.createElement("span", {className: clearClass, onClick: this.clear})
                )
                
            );
        }
    });

}(Cellar));
