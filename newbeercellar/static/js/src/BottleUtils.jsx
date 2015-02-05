var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    
    function wrapRatebeerLink(text, bottle) {
        return (<a href={bottle.ratebeerUrl}>{text}</a>);
    }


    ns.listElements = [
        {property: 'breweryName', className: 'td-20', editable: false},
        {property: 'beerName', className: 'td-20', wrap: wrapRatebeerLink, editable: false},
        {property: 'batchNo', className: 'td-10', editable: true, type: 'string'},
        {property: 'brewDate', className: 'td-10', editable: true, type: 'date'},
        {property: 'bbfDate', className: 'td-10', editable: true, type: 'date'},
        {property: 'size', className: 'td-5', editable: true, type: 'string'},
        {property: 'amount', className: 'td-5', editable: true, type: 'int'},
        {property: 'comment', className: 'td-17', editable: true, type: 'text'}
    ];


    var transformers = {
        date: {
            toSave: function (value) {
                if (value === '') {
                    return null;
                }
                return moment(value, 'DD.MM.YYYY').format('YYYY-MM-DD');
            },
            toDisplay: function (value) {
                if (value) {
                    return moment(value).format('DD.MM.YYYY');    
                }
                return '';
            },
        }
    };


    ns.getTransformersForElement = function (key) {
        var element = _.find(ns.listElements, function (element) {
            return element.property === key;
        });
        if (_.has(transformers, element.type)) {
            return transformers[element.type];
        } return null;
    };


    ns.bottleRendrers = {
        'string': function (data, key) {            
            return (
                <input 
                    className="form-control"
                    ref={key}
                    key={key}
                    value={data}
                    defaultValue=""
                    onChange={_.bind(this.formChange, this, key)}
                    type="text" />
            );
        },
        'date': function (data, key) {
            return (
                <ns.DatePicker
                onChange={_.bind(this.formChange, this, key)}
                key={key}
                value={transformers.date.toDisplay(data)}
                ref={key} />
            );
        },
        'text':function (data, key) {
            return (
                <textarea 
                    className="form-control" 
                    ref={key}
                    value={data}                     
                    defaultValue=""
                    onChange={_.bind(this.formChange, this, key)}
                    key={key} />
            );
        }, 
        'int': function (data, key) {
            return (
                <input
                    type="number"
                    className="form-control"
                    ref={key}
                    value={data}         
                    defaultValue=""
                    onChange={_.bind(this.formChange, this, key)}
                    key={key} />
            );
        }
    };


}(Cellar));