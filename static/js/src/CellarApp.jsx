var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

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

        sortBy: function (key, type, order) {
            var sortFunc = ns.createSort(type, key, order);
            var sorted = this.state.bottles.sort(sortFunc);
            this.setState({
                bottles: sorted
            });
        },

        render: function () {
            var creator = null;
            var addClass = "btn btn-primary";
            if (this.state.showCreate) {
                creator = <ns.BottleCreator 
                            cellarId={this.props.cellarId}
                            bottleAdded={this.bottleAdded} 
                            cancelAdd={this.cancelAdd}/>;
                addClass += ' hidden';                        
            }

            return (
                <div>
                    <table className="table">
                        <ns.TableHeader sortBy={this.sortBy} />
                        <ns.BottleList bottles={this.state.bottles}/>
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

    ns.createList = function (cellarId, bottles) {
        React.render(
          <Cellar bottles={bottles} cellarId={cellarId} />,
          document.getElementById('beer_table')
        );
    };

}(Cellar));