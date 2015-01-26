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

var Cellar = React.createClass({

    getInitialState: function () {
        return {bottles: _.clone(this.props.bottles), showCreate: false};
    },

    bottleAdded: function (bottle) {
        this.setState({
            bottles: this.state.bottles.concat([bottle]),
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
        var addClass = "btn btn-primary";
        if (this.state.showCreate) {
            creator = <BottleCreator 
                        cellarId={this.props.cellarId}
                        bottleAdded={this.bottleAdded} 
                        cancelAdd={this.cancelAdd}/>;
            addClass += ' hidden';                        
        }

        return (
            <div>
                <table className="table">
                    <TableHeader/>
                    <BottleList bottles={this.state.bottles}/>
                </table>
                {creator}
                <button 
                    type="button" 
                    className={addClass}
                    onClick={this.toggleCreate}>Add Bottle</button>
            </div>
        );  
    }
});

function createList(cellarId, bottles) {
    React.render(
      <Cellar bottles={bottles} cellarId={cellarId} />,
      document.getElementById('beer_table')
    );
}