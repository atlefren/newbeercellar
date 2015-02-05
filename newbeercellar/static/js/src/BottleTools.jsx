/*global React: false */

var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';
    ns.BottleTools = React.createClass({

        edit: function (e) {
            e.preventDefault();
            this.props.editBottle();
        },

        remove: function (e) {
            e.preventDefault();
            this.props.removeBottle();
        },

        render: function () {
            var hidden;
            if (!this.props.isVisible) {
                hidden = "hidden";
            }
            return (
                <td className="td-3">
                <div className={hidden}>
                    <a className="table-tool" href="" title="Edit" onClick={this.edit}>
                        <span className="glyphicon glyphicon-edit"></span>
                    </a>
                    <a className="table-tool" href=""  title="Remove" onClick={this.remove}>
                        <span className="glyphicon glyphicon-remove-circle"></span>
                    </a>
                    </div>
                </td>
            );
        }
    });
}(Cellar));
