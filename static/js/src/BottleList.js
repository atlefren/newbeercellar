var Bottle = React.createClass({displayName: "Bottle",
    render: function () {
        return (
            React.createElement("tr", null, 
                React.createElement("td", null, this.props.bottle.breweryName), 
                React.createElement("td", null, this.props.bottle.beerName), 
                React.createElement("td", null, this.props.bottle.batchNo), 
                React.createElement("td", null, this.props.bottle.brewDate), 
                React.createElement("td", null, this.props.bottle.bbfDate), 
                React.createElement("td", null, this.props.bottle.size), 
                React.createElement("td", null, this.props.bottle.amount), 
                React.createElement("td", null, this.props.bottle.comment)
            )
        );
    }
});


var BottleList = React.createClass({displayName: "BottleList",
  
    render: function() {
      var bottleNodes = this.props.bottles.map(function (bottle) {
          return (
              React.createElement(Bottle, {bottle: bottle, key: bottle.id})
          );
      });
      return (
          React.createElement("tbody", null, bottleNodes)
          
      );
    }
});