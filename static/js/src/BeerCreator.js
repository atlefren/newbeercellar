function intOrNull(value) {
    var conv = parseInt(value, 10);
    if (_.isNaN(conv)) {
        return null;
    }
    return conv;
}


function dateOrNull(value) {
    if (value === '') {
        return null;
    }
    return value;
}


var DatePicker = React.createClass({displayName: "DatePicker",

    render: function () {
        return (
            React.createElement("input", {
                type: "text", 
                className: "form-control", 
                placeholder: this.props.placeholder})
        );
    }

});

var BeerCreator = React.createClass({displayName: "BeerCreator",

    getInitialState: function() {
        return {beerId: null, breweryId: null};
    },

    selectBrewery: function (brewery) {
        this.setState({breweryId: brewery.id});
    },

    selectBeer: function (beer) {
        this.setState({beerId: beer.id});
    },

    beerAdded: function (beer) {
        this.props.beerAdded(beer);
    },

    cancel: function () {
        this.props.cancelAdd();
    },

    save: function () {
        var data = {
            "breweryId": this.state.breweryId,
            "beerId": this.state.beerId,
            "batchNo": this.refs.batch.getDOMNode().value,
            "brewDate": dateOrNull(this.refs.brewdate.getDOMNode().value),
            "bbfDate": dateOrNull(this.refs.bbfdate.getDOMNode().value),
            "size": intOrNull(this.refs.size.getDOMNode().value),
            "amount": parseInt(this.refs.amount.getDOMNode().value, 10),
            "comment": this.refs.comment.getDOMNode().value
         };

        $.ajax({
            url: "/cellar/" + this.props.cellarId + "/add/",
            type: "POST",
            data: JSON.stringify(data),
            success: this.beerAdded,
            contentType: 'application/json',
            dataType: 'json'
        });
    },

    render: function () {
        var beerSearchParams = {brewery: this.state.breweryId};
        var disabled = !(this.state.beerId && this.state.breweryId);        
        return (
            React.createElement("table", {className: "table"}, 
                React.createElement("tbody", null, 
                    React.createElement("tr", null, 
                        React.createElement("td", {className: "td-20"}, 
                            React.createElement(Autocomplete, {
                                placeholder: "Brewery", 
                                url: "/search/brewery", 
                                select: this.selectBrewery})
                          ), 
                          React.createElement("td", {className: "td-20"}, 
                            React.createElement(Autocomplete, {
                                placeholder: "Beer", 
                                url: "/search/beer", 
                                extraParams: beerSearchParams, 
                                select: this.selectBeer})
                          ), 
                          React.createElement("td", {className: "td-10"}, 
                            React.createElement("input", {type: "text", ref: "batch", className: "form-control", placeholder: "bath #"})
                          ), 
                          React.createElement("td", {className: "td-10"}, 
                            React.createElement(DatePicker, {ref: "brewdate", placeholder: "brew date"})
                          ), 
                          React.createElement("td", {className: "td-10"}, 
                            React.createElement(DatePicker, {ref: "bbfdate", placeholder: "best before date"})
                          ), 
                          React.createElement("td", {className: "td-5"}, 
                            React.createElement("input", {type: "date", ref: "size", className: "form-control", placeholder: "size (cl)"})
                          ), 
                          React.createElement("td", {className: "td-5"}, 
                            React.createElement("input", {type: "number", defaultValue: "1", ref: "amount", className: "form-control"})
                          ), 
                          React.createElement("td", {className: "td-20"}, 
                            React.createElement("textarea", {ref: "comment", className: "form-control"})
                          )
                    ), 
                    React.createElement("tr", {colSpan: "8"}, 
                        React.createElement("td", null, 
                            React.createElement("button", {
                                type: "button", 
                                disabled: disabled, 
                                className: "btn btn-primary", 
                                onClick: this.save}, "Save"), 
                            React.createElement("button", {
                                type: "button", 
                                className: "btn", 
                                onClick: this.cancel}, "Cancel")
                        )
                    )
                )
            )
        );    
    }
});