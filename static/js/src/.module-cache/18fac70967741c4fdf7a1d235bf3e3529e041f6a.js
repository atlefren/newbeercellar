var BeerList = React.createClass({displayName: "BeerList",
  render: function() {
    return (
      React.createElement("tbody", null
        
      )
    );
  }
});


React.render(
  React.createElement(BeerList, null),
  document.getElementById('beer_table')
);