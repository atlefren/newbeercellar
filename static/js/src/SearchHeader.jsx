var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';
    ns.SearchHeader = React.createClass({    
        
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
                <div className="inner-addon left-addon right-addon">
                    <span className="left-addon glyphicon glyphicon-search"></span>
                    <input 
                    onChange={this.search}
                    value={this.state.phrase}
                    ref="value"
                    type="text"
                    className="form-control"
                    placeholder="Filter by beer or brewery.." />
                    <span className={clearClass} onClick={this.clear}></span>
                </div>
                
            );
        }
    });

}(Cellar));
