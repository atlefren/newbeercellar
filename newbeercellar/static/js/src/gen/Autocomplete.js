var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    /*
    This is a list element in a dropdown, reperesenting individual search results.
    */
    var AutocompleteItem = React.createClass({displayName: "AutocompleteItem",

        select: function (e) {
            e.preventDefault();
            this.props.selectItem(this.props.item);
        },

        onMouseOver: function () {
            //tell the parent to change class of others
            this.props.mouseOver(this.props.item);
        },

        render: function () {
            var className = '';
            if (this.props.selected) {
                className = 'selected';
            }
            return (
                React.createElement("li", null, 
                    React.createElement("a", {href: "/#", 
                        tabIndex: "-1", 
                        onClick: this.select, 
                        onMouseOver: this.onMouseOver, 
                        className: className}, 
                        this.props.item.name
                    )
                )
            ); 
        }
    });

    /*
    This is an autocomplete input form with search as you type-results displayed
    in a bootstrap dropdown, selectable by mouse and keyboard 
    */
    ns.Autocomplete = React.createClass({displayName: "Autocomplete",

        getInitialState: function() {
            return {
                searchVal: '',
                results: [],
                selectedItem: null,
                selectedIdx: 0
            };
        },

        //trigger a new search, resetting the results and selected item
        search: function () {
            var val = this.refs.value.getDOMNode().value;
            
            //only trigger a search if we have a search value
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

        //show the result list, select the first item
        showResults: function (results) {
            this.setState({results: results, selectedIdx: 0});
        },

        //select an item, tell the parent and update state
        selectItem: function (item) {
            this.setState({searchVal: item.name});
            this.setState({selectedItem: item});
            this.props.select(item);
        },

        //change the index, wrapping around
        changeSelectedIdx: function (delta) {
            var newIndex = this.state.selectedIdx + delta;
            if (newIndex >= this.state.results.length) {
                newIndex = 0;
            } else if (newIndex < 0) {
                newIndex = this.state.results.length - 1;
            }
            this.setState({selectedIdx: newIndex});
        },

        //one of the children had a mouseover, highlight it and dehighlight others
        mouseOver: function (item) {
            this.setState({selectedIdx: this.state.results.indexOf(item)});
        },

        onKeyDown: function (e) {
            console.log(e.which);
            if (e.which === 13 || e.which === 9) { //enter or tab
                var item = this.state.results[this.state.selectedIdx];
                if (item) {
                    this.selectItem(item);
                }
            } else if (e.which === 40) { //down
                this.changeSelectedIdx(1);
            } else if (e.which === 38) { //up
                this.changeSelectedIdx(-1);
            }
        },

        render: function () {
            var resultsStyle = {display: "block"};
            var itemNodes = [];
            var inputClass = 'form-control';
            
            if (!this.state.results.length || this.state.selectedItem !== null) {
                //there are no results or we have a selected item
                resultsStyle = {display: "none"};
            } else {
                //there are results to display
                inputClass += ' active';
                itemNodes = _.map(this.state.results, function (item, key) {
                    var selected = this.state.selectedIdx === key;
                    return (
                        React.createElement(AutocompleteItem, {
                            key: item.id, 
                            item: item, 
                            selected: selected, 
                            mouseOver: this.mouseOver, 
                            selectItem: this.selectItem})
                    );
                }, this);    
            }
            return (
                React.createElement("div", {className: "dropdown autocomplete"}, 
                    React.createElement("input", {
                        value: this.state.searchVal, 
                        type: "text", 
                        placeholder: this.props.placeholder, 
                        ref: "value", 
                        className: inputClass, 
                        onKeyDown: this.onKeyDown, 
                        onChange: this.search}), 
                    React.createElement("ul", {
                        className: "dropdown-menu autocomplete-results", 
                        style: resultsStyle}, 
                        itemNodes
                    )
                )
            );
        }
    });

}(Cellar));
