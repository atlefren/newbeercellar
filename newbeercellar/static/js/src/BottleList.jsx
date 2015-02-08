/*global React: false */

var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    ns.BottleList = React.createClass({

        render: function () {
            var bottleNodes = _.chain(this.props.bottles)
                .filter(function (bottle) {
                    return !bottle.hidden;
                })
                .map(function (bottle) {
                    return (
                        <ns.BottleElement
                            isEditable={this.props.isEditable}
                            bottleRemoved={this.props.bottleRemoved}
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
