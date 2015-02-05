var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    ns.BottleList = React.createClass({      
        render: function() {
            var bottleNodes = _.chain(this.props.bottles)
                .filter(function (bottle) {
                    return !bottle.hidden;
                })
                .map(function (bottle) {
                    return (
                        <ns.BottleElement bottle={bottle} key={bottle.id} />
                    );
                })
                .value();

            return (
                <tbody>{bottleNodes}</tbody>
            );
        }
    });  
}(Cellar));
