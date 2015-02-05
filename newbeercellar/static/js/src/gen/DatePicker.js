/*global React: false */

var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    ns.DatePicker = React.createClass({displayName: "DatePicker",

        componentDidMount: function () {
            $(this.getDOMNode()).datepicker({
                format: 'dd.mm.yyyy'
            }).on('changeDate', _.bind(this.onChange, this));
        },

        onChange: function () {
            if (this.props.onChange) {
                this.props.onChange({target: this.getDOMNode()});
            }
        },

        render: function () {
            return (
                React.createElement("input", {
                    value: this.props.value, 
                    placeholder: "dd.mm.yyyy", 
                    onChange: this.onChange, 
                    className: "form-control"})
            );
        }
    });

}(Cellar));
