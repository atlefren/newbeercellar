var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    function formatDate(date) {
        if (date) {
            return moment(date).format('DD.MM.YYYY');    
        }
        return '';        
    }
    
    var Bottle = React.createClass({
        render: function () {
            return (
                <tr>
                    <td className="td-20">
                        {this.props.bottle.breweryName}
                    </td>
                    <td className="td-20">
                        {this.props.bottle.beerName}
                    </td>
                    <td className="td-10">
                        {this.props.bottle.batchNo}
                    </td>
                    <td className="td-10">
                        {formatDate(this.props.bottle.brewDate)}
                    </td>
                    <td className="td-10">
                        {formatDate(this.props.bottle.bbfDate)}
                    </td>
                    <td className="td-5">
                        {this.props.bottle.size}
                    </td>
                    <td className="td-5">
                        {this.props.bottle.amount}
                    </td>
                    <td className="td-20">
                        {this.props.bottle.comment}
                    </td>
                </tr>
            );
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
