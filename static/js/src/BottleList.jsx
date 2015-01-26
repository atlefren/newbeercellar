var Bottle = React.createClass({
    render: function () {
        return (
            <tr>
                <td>{this.props.bottle.breweryName}</td>
                <td>{this.props.bottle.beerName}</td>
                <td>{this.props.bottle.batchNo}</td>
                <td>{this.props.bottle.brewDate}</td>
                <td>{this.props.bottle.bbfDate}</td>
                <td>{this.props.bottle.size}</td>
                <td>{this.props.bottle.amount}</td>
                <td>{this.props.bottle.comment}</td>
            </tr>
        );
    }
});


var BottleList = React.createClass({
  
    render: function() {
      var bottleNodes = this.props.bottles.map(function (bottle) {
          return (
              <Bottle bottle={bottle} key={bottle.id} />
          );
      });
      return (
          <tbody>{bottleNodes}</tbody>
          
      );
    }
});