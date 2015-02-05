var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';


    ns.BottleElement = React.createClass({displayName: "BottleElement",

        getInitialState: function () {
            return {showEdit: false, bottle: this.props.bottle};
        },

        editBottle: function (bottleId) {
            this.setState({showEdit: true});
        },

        removeBottle: function (bottleId) {
        },

        createDisplayCell: function (element) {
            var text = this.state.bottle[element.property];
            var transformers = ns.getTransformersForElement(element.property);
            if (transformers) {
                text = transformers.toDisplay(text);
            }
            if (element.wrap) {
                text = element.wrap(text, this.state.bottle);
            }
            return (
                React.createElement("td", {
                    className: element.className, 
                    key: element.property}, 
                    text
                )
            );
        },

        createEditCell: function (element) {
            if (!element.editable || !_.has(ns.bottleRendrers, element.type)) {
                return this.createDisplayCell(element);
            }
            var data = this.state.bottle[element.property];
            var renderer = _.bind(ns.bottleRendrers[element.type], this);
            return (
                React.createElement("td", {
                    className: element.className, 
                    key: element.property}, 
                    renderer(data, element.property)
                )
            );
        },

        saveBottle: function () {
            $.ajax({
                url: '/api/v1/bottle/' + this.state.bottle.id + '/',
                type: 'PUT',
                data: JSON.stringify(this.state.bottle),
                success: _.bind(this.bottleSaved, this),
                dataType: 'json',
                contentType: 'application/json'
            });
        },

        bottleSaved: function (bottle) {
            this.setState({bottle: bottle, showEdit: false});
        },

        formChange: function (key, event) {
            var bottle = this.state.bottle;
            var transformers = ns.getTransformersForElement(key);
            if (transformers) {
                bottle[key] = transformers.toSave(event.target.value);
            } else {
                bottle[key] = event.target.value;
            }
            this.setState({bottle: bottle});
        },

        render: function () {          
            var elementNodes = [];
            if (!this.state.showEdit) {
                elementNodes = _.map(ns.listElements, this.createDisplayCell , this)
                elementNodes.unshift(
                    React.createElement(ns.BottleTools, {editBottle: this.editBottle, key: "edit"})
                );
            } else {
                elementNodes = _.map(ns.listElements, this.createEditCell , this)
                elementNodes.unshift(
                    React.createElement(ns.SaveBtn, {saveBottle: this.saveBottle})
                );                
            }
            return (React.createElement("tr", null, elementNodes));
            
        }
    });
}(Cellar));