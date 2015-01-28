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
            var clearClass = "right clear-btn glyphicon glyphicon-remove-circle";
            if (!this.state.phrase) {
                //clearClass += " hidden";
            }
            return (
                <div className="filtersearch form-control">
                    <span className="left glyphicon glyphicon-search"></span>
                    <input
                    className="filtersearch"
                    onChange={this.search}
                    value={this.state.phrase}
                    ref="value"
                    type="text"
                    placeholder="Filter by beer or brewery.." />
                    <span className={clearClass} onClick={this.clear}></span>
                </div>

            );
        }
    });

}(Cellar));
