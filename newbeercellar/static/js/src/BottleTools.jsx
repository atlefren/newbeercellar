var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';
    ns.BottleTools = React.createClass({

        edit: function (e) {
            e.preventDefault();
            this.props.editBottle(this.props.bottleId);
        },

        remove: function (e) {
            e.preventDefault();
            this.props.removeBottle(this.props.bottleId);
        },

        render: function () {
            return (
                <td className="td-3">
                    <a className="table-tool" href="" title="Edit" onClick={this.edit}>
                        <span className="glyphicon glyphicon-edit"></span>
                    </a>
                    <a className="table-tool" href=""  title="Remove" onClick={this.remove}>
                        <span className="glyphicon glyphicon-remove-circle"></span>
                    </a>
                </td>
            );
        }
    });
}(Cellar));
