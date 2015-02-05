/*global React: false */

var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    ns.QuickFilter = React.createClass({

        render: function () {
            return (
                <select className="form-control">
                    <option selected>Quick filter</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            );
        }
    });

}(Cellar));