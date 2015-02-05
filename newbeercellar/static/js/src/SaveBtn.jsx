var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    ns.SaveBtn = React.createClass({

        save: function (e) {
            e.preventDefault();         
            this.props.saveBottle();
        },

        render: function () {
            return (
                <td className="td-3">
                    <a className="table-tool" href="" title="Save" onClick={this.save}>
                        <span className="glyphicon glyphicon-floppy-disk"></span>
                    </a>
                </td>
            );
        }
    });

}(Cellar));
