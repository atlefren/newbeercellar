var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

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
        return moment(value, "DD.MM.YYYY").format('YYYY-MM-DD');
    }


    var DatePicker = React.createClass({

        componentDidMount: function() {
            $(this.getDOMNode()).datepicker({
                format: 'dd.mm.yyyy'
            });
        },

        render: function () {
            return (
                <input 
                    placeholder="dd.mm.yyyy"
                    className="form-control" />
            );
        }
    });

    ns.BottleCreator = React.createClass({

        getInitialState: function() {
            return {beerId: null, breweryId: null};
        },

        selectBrewery: function (brewery) {
            this.setState({breweryId: brewery.id});
        },

        selectBeer: function (beer) {
            this.setState({beerId: beer.id});
        },

        bottleAdded: function (bottle) {
            this.props.bottleAdded(bottle);
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
                url: "/api/v1/cellar/" + this.props.cellarId + "/add/",
                type: "POST",
                data: JSON.stringify(data),
                success: this.bottleAdded,
                contentType: 'application/json',
                dataType: 'json'
            });
        },

        render: function () {
            var beerSearchParams = {brewery: this.state.breweryId};
            var disabled = !(this.state.beerId && this.state.breweryId);        
            return (
                <table className="table">
                    <tbody>
                        <tr>
                            <td className="td-20">
                                <ns.Autocomplete 
                                    placeholder="Brewery" 
                                    url='/api/v1/search/brewery/' 
                                    select={this.selectBrewery} />
                              </td>
                              <td className="td-20">
                                <ns.Autocomplete 
                                    placeholder="Beer" 
                                    url='/api/v1/search/beer/'
                                    extraParams={beerSearchParams}
                                    select={this.selectBeer} />
                              </td>
                              <td className="td-10">
                                <input type="text" ref="batch" className="form-control" placeholder="bath #"/>
                              </td>
                              <td  className="td-10">
                                <DatePicker ref="brewdate" placeholder="brew date"/>
                              </td>
                              <td  className="td-10">
                                <DatePicker ref="bbfdate" placeholder="best before date"/>                            
                              </td>
                              <td  className="td-5"> 
                                <input type="date" ref="size" className="form-control" placeholder="size (cl)"/>
                              </td>
                              <td  className="td-5">
                                <input type="number" defaultValue="1" ref="amount" className="form-control"/>
                              </td>
                              <td className="td-20"> 
                                <textarea ref="comment" className="form-control" />
                              </td>
                        </tr>
                        <tr colSpan="8">
                            <td>
                                <button 
                                    type="button" 
                                    disabled={disabled}
                                    className="btn btn-primary" 
                                    onClick={this.save}>Save</button>
                                <button 
                                    type="button" 
                                    className="btn" 
                                    onClick={this.cancel}>Cancel</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            );    
        }
    });

}(Cellar));
