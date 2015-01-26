var AutocompleteItem = React.createClass({

    select: function (e) {
        e.preventDefault();
        this.props.selectItem(this.props.item);
    },

    render: function () {
        return (
            <li>
                <a href="/#" tabIndex="-1" onClick={this.select}>
                    {this.props.item.name}
                </a>
            </li>
        ); 
    }
});

var Autocomplete = React.createClass({

    getInitialState: function() {
        return {searchVal: '', results: [], selectedItem: null};
    },

    search: function () {
        var val = this.refs.value.getDOMNode().value;
        
        if (val !== this.state.searchVal && val !== '') {
            this.setState({searchVal: val});
            $.ajax({
                url: this.props.url,
                data: _.extend({q: val}, this.props.extraParams),
                success: this.showResults,
                dataType: 'json'
            });
        }
        if (val === '') {
            this.showResults([]);
        }
        this.setState({selectedItem: null});
        this.setState({searchVal: val});
    },

    showResults: function (results) {
        this.setState({results: results});
    },

    selectItem: function (item) {
        this.setState({searchVal: item.name});
        this.setState({selectedItem: item});
        this.props.select(item);
    },

    render: function () {
        var style = {display: "block"};
        var itemNodes = [];
        if (!this.state.results.length || this.state.selectedItem !== null) {
            style = {display: "none"};
        } else {
            itemNodes = this.state.results.map(function (item) {
                return (
                    <AutocompleteItem key={item.id} item={item} selectItem={this.selectItem}/>
                );
            }, this);    
        }
        return (
            <div className="dropdown">
                <input 
                    value={this.state.searchVal}
                    type="text" 
                    placeholder={this.props.placeholder}
                    ref="value"
                    className="form-control"
                    onChange={this.search} />
                <ul className="dropdown-menu" style={style}>
                    {itemNodes}
                </ul>
            </div>
        );
    }
});