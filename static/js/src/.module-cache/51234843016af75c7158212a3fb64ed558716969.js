var BeerList = React.createClass({displayName: "BeerList",
  render: function() {
    return (
      React.createElement("tr", null, React.createElement("td", null, "test"))
    );
  }
});


React.render(
  React.createElement(BeerList, null),
  document.getElementById('beer_list')
);