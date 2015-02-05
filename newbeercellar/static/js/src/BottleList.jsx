var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    ns.BottleList = React.createClass({

        getInitialState: function () {
            return {bottles: this.props.bottles};
        },

        bottleRemoved: function (removedBottle) {
            var newBottles = _.reject(this.state.bottles, function (bottle) {
                return (bottle.id === removedBottle.id);
            });
            this.setState({bottles: newBottles});
        },

        render: function() {
            var bottleNodes = _.chain(this.state.bottles)
                .filter(function (bottle) {
                    return !bottle.hidden;
                })
                .map(function (bottle) {
                    return (
                        <ns.BottleElement
                            bottleRemoved={this.bottleRemoved}
                            bottle={bottle}
                            key={bottle.id} />
                    );
                }, this)
                .value();

            return (
                <tbody>{bottleNodes}</tbody>
            );
        }
    });  
}(Cellar));
