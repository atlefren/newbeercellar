var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    function formatDate(date) {
        if (date) {
            return moment(date).format('DD.MM.YYYY');    
        }
        return '';        
    }

    var BottleTools = React.createClass({

        edit: function (e) {
            e.preventDefault();
            console.log("edit");
            this.props.editBottle(this.props.bottleId);
        },

        remove: function (e) {
            e.preventDefault();
            console.log("remove");
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

    function wrapRatebeerLink(text, bottle) {
        return (<a href={bottle.ratebeerUrl}>{text}</a>);
    }
    
    var Bottle = React.createClass({

        getInitialState: function () {
            return {showEdit: false};
        },

        editBottle: function (bottleId) {
            console.log("edit!");
            this.setState({showEdit: true});
        },

        removeBottle: function (bottleId) {
        },

        createDisplayCell: function (element) {
            var text = this.props.bottle[element.property];
            if (element.wrap) {
                text = element.wrap(text, this.props.bottle);
            }
            return (
                <td 
                    className={element.className} 
                    key={element.property}>
                    {text}
                </td>
            );
        },

        createEditCell: function (element) {
            if (!element.editable) {
                return this.createDisplayCell(element);
            }
            var text = this.props.bottle[element.property];
            return (
                <td 
                    className={element.className} 
                    key={element.property}>
                    <input className="form-control" value={text}/>
                </td>
            );
        },

        render: function () {
            var elements = [
                {property: 'breweryName', className: 'td-20', editable: false},
                {property: 'beerName', className: 'td-20', wrap: wrapRatebeerLink, editable: false},
                {property: 'batchNo', className: 'td-10', editable: true},
                {property: 'brewDate', className: 'td-10', wrap: formatDate, editable: true},
                {property: 'bbfDate', className: 'td-10', wrap: formatDate, editable: true},
                {property: 'size', className: 'td-5', editable: true},
                {property: 'amount', className: 'td-5', editable: true},
                {property: 'comment', className: 'td-17', editable: true}
            ];
            var elementNodes = [];
            if (!this.state.showEdit) {
                elementNodes = _.map(elements, this.createDisplayCell , this)
                elementNodes.unshift(
                    <BottleTools editBottle={this.editBottle} key="edit" />
                );
            } else {
                elementNodes = _.map(elements, this.createEditCell , this)
                elementNodes.unshift(<td className="td-3">s</td>);
            }
            return (<tr>{elementNodes}</tr>);
        }
    });


    ns.BottleList = React.createClass({
      
        render: function() {
            var bottleNodes = _.chain(this.props.bottles)
                .filter(function (bottle) {
                    return !bottle.hidden;
                })
                .map(function (bottle) {
                    return (
                        <Bottle bottle={bottle} key={bottle.id} />
                    );
                })
                .value();

            return (
                <tbody>{bottleNodes}</tbody>
            );
        }
    });  
}(Cellar));
