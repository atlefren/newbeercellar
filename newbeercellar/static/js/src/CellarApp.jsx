/*global React: false */

var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';


    function match(query, attr) {
        return (attr.toLowerCase().indexOf(query) !== -1);
    }


    var BottleCounter = React.createClass({

        numBottles: function () {
            return _.reduce(this.props.bottles, function (acc, bottle) {
                return acc += bottle.amount;
            }, 0);
        },

        render: function () {
            var num = this.numBottles();
            return (<p>Number of bottles: {num}</p>);
        }
    })

    var Cellar = React.createClass({

        getInitialState: function () {
            return {bottles: _.clone(this.props.bottles), showCreate: false};
        },

        bottleAdded: function (bottle) {
            this.setState({
                bottles: [bottle].concat(this.state.bottles),
                showCreate: false
            });
        },

        bottleRemoved: function (removedBottle) {
            var newBottles = _.reject(this.state.bottles, function (bottle) {
                return (bottle.id === removedBottle.id);
            });
            this.setState({bottles: newBottles});
        },

        bottleEdited: function (editedBottle) {
            var bottles = _.map(this.state.bottles, function (bottle) {
                if (bottle.id === editedBottle.id) {
                    bottle.amount = editedBottle.amount;
                }
                return bottle;
            });
            this.setState({bottles: bottles});
        },

        cancelAdd: function () {
            this.setState({showCreate: false});
        },

        toggleCreate: function () {
            this.setState({showCreate: true});
        },

        sortBy: function (key, type, order) {
            var sortFunc = ns.createSort(type, key, order);
            var sorted = this.state.bottles.sort(sortFunc);
            this.setState({
                bottles: sorted
            });
        },

        search: function (query) {
            if (query) {
                query = query.toLowerCase();
            }
            var filtered = _.map(this.state.bottles, function (bottle) {
                if (!query) {
                    bottle.hidden = false;
                    return bottle;
                }
                var beerMatch = match(query, bottle.beerName);
                var breweryMatch = match(query, bottle.breweryName);

                var searchHit = beerMatch || breweryMatch;
                bottle.hidden = !searchHit;
                return bottle;
            });
            this.setState({bottles: filtered});
        },

        render: function () {
            var creator = null;
            var addClass = "btn btn-primary";
            if (this.state.showCreate && this.props.isEditable) {
                creator = <ns.BottleCreator 
                            cellarId={this.props.cellarId}
                            bottleAdded={this.bottleAdded} 
                            cancelAdd={this.cancelAdd}/>;
                addClass += ' hidden';
            }

            var createButton = null;
            if (this.props.isEditable) {
                createButton = <button
                                type="button"
                                className={addClass}
                                onClick={this.toggleCreate}>Add Bottle</button>;
            }
            return (
                <div>
                    <div className="row">
                        <div className="col-lg-7">
                            {createButton}
                        </div>
                        <div className="col-lg-2">
                        </div>
                        <div className="col-lg-3">
                            <ns.SearchHeader search={this.search} />
                        </div>
                    </div>
                    {creator}
                    <table className="table">
                        <ns.TableHeader sortBy={this.sortBy} />
                        <ns.BottleList
                            isEditable={this.props.isEditable}
                            bottles={this.state.bottles}
                            bottleEdited={this.bottleEdited}
                            bottleRemoved={this.bottleRemoved} />
                    </table>
                    <BottleCounter bottles={this.state.bottles}/>
                </div>
            );
        }
    });

    ns.createList = function (cellarId, bottles, isEditable) {
        React.render(
          <Cellar
            bottles={bottles}
            cellarId={cellarId}
            isEditable={isEditable} />,
          document.getElementById('beer_table')
        );
    };

}(Cellar));