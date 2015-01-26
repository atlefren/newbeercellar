var TableHeader = React.createClass({

    render: function () {
        return (<thead>
          <tr>
            <th>Brewery</th>
            <th>Beer</th>
            <th>Batch #</th>
            <th>Brew date</th>
            <th>Best before date</th>
            <th>Size</th>
            <th>Amount</th>
            <th>Comment</th>
          </tr>
        </thead>);
    }
});

var BeerTable = React.createClass({

    getInitialState: function () {
        return {beers: _.clone(this.props.beers), showCreate: false};
    },

    beerAdded: function (beer) {
        this.setState({
            beers: this.state.beers.concat([beer]),
            showCreate: false
        });
    },

    cancelAdd: function () {
        this.setState({showCreate: false});
    },

    toggleCreate: function () {
        this.setState({showCreate: true});
    },

    render: function () {
        var creator = null;
        if (this.state.showCreate) {
            creator = <BeerCreator 
                            beerAdded={this.beerAdded} 
                            cancelAdd={this.cancelAdd}/>;
        }   
        return (
            <div>
                <table className="table">
                    <TableHeader/>
                    <BottleList bottles={this.state.beers}/>
                </table>
                {creator}
                <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={this.toggleCreate}>Add Bottle</button>
            </div>
        );  
    }
});

function createList(beers) {
    React.render(
      <BeerTable beers={beers}/>,
      document.getElementById('beer_table')
    );
}