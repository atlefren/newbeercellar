

var Beer = React.createClass({
    render: function () {
        return (
            <tr>
                <td>{this.props.beer.breweryName}</td>
                <td>{this.props.beer.beerName}</td>
                <td>{this.props.beer.batchNo}</td>
                <td>{this.props.beer.brewDate}</td>
                <td>{this.props.beer.bbfDate}</td>
                <td>{this.props.beer.size}</td>
                <td>{this.props.beer.amount}</td>
                <td>{this.props.beer.comment}</td>
            </tr>
        );
    }
});


var BeerList = React.createClass({
  
    render: function() {
      var beerNodes = this.props.beers.map(function (beer) {
          return (
              <Beer beer={beer} key={beer.beerId} />
          );
      });
      return (
          <tbody>{beerNodes}</tbody>
          
      );
    }
});

var AutocompleteItem = React.createClass({

    select: function (e) {
        e.preventDefault();
        this.props.selectItem(this.props.item);
        return false;
    },

    render: function () {
        return (
            <li>
                <a href="/#" tabindex="-1" onClick={this.select}>
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
        var val = this.refs.input.getDOMNode().value;
        
        if (val !== this.state.searchVal && val !== '') {
            this.setState({searchVal: val});
            $.ajax({
                url: this.props.url,
                data: _.extend({q: val}, this.props.extraParams),
                success: this.showResults,
                dataType: 'json'
            });
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

    input: React.createClass({
        render: function () {
            return (
                <input 
                    value={this.props.value}
                    type="text" 
                    placeholder={this.props.placeholder}
                    ref="value"
                    className="form-control"
                    onChange={this.props.search} />
            );
        }
    }),

    render: function () {
        var style = {display: "block"};
        var itemNodes = [];
        if (!this.state.results.length || this.state.selectedItem !== null) {
            style = {display: "none"};
        } else {
            itemNodes = this.state.results.map(function (item) {
                return (
                    <AutocompleteItem item={item} selectItem={this.selectItem}/>
                );
            }, this);    
        }
        return (
            <div className="dropdown">
                <this.input 
                    ref="input" 
                    value={this.state.searchVal} 
                    search={this.search} 
                    placeholder={this.props.placeholder} />
                <ul className="dropdown-menu" style={style}>
                    {itemNodes}
                </ul>
            </div>
        );
    }
});

var BeerCreator = React.createClass({

    getInitialState: function() {
        return {showCreate: false, beerId: null, breweryId: null};
    },

    show: function () {
        this.setState({showCreate: true});
    },

    selectBrewery: function (brewery) {
        this.setState({breweryId: brewery.id});
    },

    selectBeer: function (beer) {
        this.setState({beerId: beer.id});
    },

    beerAdded: function (beer) {
        this.props.beerAdded(beer);
        this.setState({showCreate: false});
    },

    save: function () {
        var data = {
             "breweryId": this.state.breweryId,
             "beerId": this.state.beerId,
             "batchNo": this.refs.batch.getDOMNode().value,
             "brewDate": this.refs.brewdate.getDOMNode().value,
             "bbfDate": this.refs.bbfdate.getDOMNode().value,
             "size": this.refs.size.getDOMNode().value,
             "amount": parseInt(this.refs.amount.getDOMNode().value, 10),
             "comment": this.refs.comment.getDOMNode().value
         };

        $.ajax({
            url: "/save",
            type: "POST",
            data: JSON.stringify(data),
            success: this.beerAdded,
            contentType: 'application/json',
            dataType: 'json'
        });
    },

    render: function () {
        if (this.state.showCreate) {
            var beerSearchParams = {brewery: this.state.breweryId};
            var searchRow = (
                <tr>
                        <td>
                            <Autocomplete 
                                placeholder="Brewery" 
                                url='/search/brewery' 
                                select={this.selectBrewery} />
                          </td>
                          <td>
                            <Autocomplete 
                                placeholder="Beer" 
                                url='/search/beer'
                                extraParams={beerSearchParams}
                                select={this.selectBeer} />
                          </td>
                          <td>
                            <input type="text" ref="batch" className="form-control"/>
                          </td>
                          <td>
                            <input type="date" ref="brewdate" className="form-control"/>
                          </td>
                          <td>
                            <input type="date" ref="bbfdate" className="form-control"/>
                          </td>
                          <td>
                            <input type="date" ref="size" className="form-control"/>
                          </td>
                          <td>
                            <input type="number" defaultValue="1" ref="amount" className="form-control"/>
                          </td>
                          <td>
                            <input type="text" ref="comment" className="form-control"/>
                          </td>
                    </tr>
                );
        
            if (this.state.beerId && this.state.breweryId) {
                return (
                    <tbody>
                        {searchRow}
                        <tr colSpan="8">
                            <td>
                                <button type="button" className="btn" onClick={this.save}>Save</button>
                            </td>
                        </tr>
                    </tbody>
                );    
            }
            return (<tbody>{searchRow}<tr></tr></tbody>);            
        } else {
            return (
                <tbody>
                <tr colSpan="8">
                    <td>
                        <button type="button" className="btn btn-primary" onClick={this.show}>
                            Add Beer
                        </button>
                    </td>
                </tr>
                </tbody>
            );
        }
    }
});

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
})

var BeerTable = React.createClass({

    getInitialState: function () {
        return {beers: _.clone(this.props.beers)};
    },

    beerAdded: function (beer) {
        this.setState({beers: this.state.beers.concat([beer])});
    },

    render: function () {
        return (
            <table className="table">
                <TableHeader/>
                <BeerList beers={this.state.beers}/>
                <BeerCreator beerAdded={this.beerAdded}/>
            </table>
        );  
    }
});

function createList(beers) {
    React.render(
      <BeerTable beers={beers}/>,
      document.getElementById('beer_table')
    );
}