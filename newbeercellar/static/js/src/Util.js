var Cellar = this.Cellar || {};
(function (ns) {
    'use strict';

    ns.createSort = function (type, key, order) {
        return function (a, b) {
            var first, second;
            if (!order) {
                first = a.id;
                second = b.id;
                type = 'num';
            } else {
                if (type === 'num') {
                    first = a[key];
                    second = b[key];
                } else if (type === 'alph') {
                    first = a[key].toLowerCase();
                    second = b[key].toLowerCase();
                } else if (type === 'date') {
                    first = moment(b[key]).unix();
                    second = moment(a[key]).unix();
                    if (_.isNaN(first)) {
                        first = 0;
                    }
                    if (_.isNaN(second)) {
                        second = 0;
                    }
                } else {
                    return 0;
                }
                if (order === 'desc') {
                    //swap
                    first = [second, second = first][0];
                }
            }

            if (first < second) {
                return -1;
            }
            if (first > second) {
                return 1;
            }
            return 0;
        };
    };

}(Cellar));