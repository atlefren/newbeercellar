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

        render: function () {
            return (
                <div className="input-group">
                  <input 
                    onChange={this.search}
                    ref="value"
                    type="text"
                    className="form-control"
                    placeholder="Filter by beer or brewery.." />
                  <span className="input-group-btn">
                    <button className="btn btn-default" type="button">
                        <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                    </button>
                  </span>
                </div>   
            );
        }
    });

}(Cellar));
