$(function() {
    $('table').on('click', 'button', tableClick);
    
    function GraphData(labels, data) {
        labels = labels || [0,1,2,3,4,5,6,7,8,9];
        data = data || [0,0,0,0,0,0,0,0,0,0];

        return {
            labels: labels,
            datasets:  [{
                label: "My First Dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: data
            }]
        }
    }

    var ctx = document.getElementById("myChart").getContext("2d");
    var chartOptions = {
        bezierCurve: false,
        responsive: true
    };
    var OptionPlot = new Chart(ctx).Line(new GraphData(), chartOptions);

    var Basket = new OptionBasket();


    function OptionBasket() {
        this._options = {};
        this.addOption = function(symbol) {
            if (this._options[symbol]) {
                this._options[symbol] = this._options[symbol] + 1;
            } else {
                this._options[symbol] = 1;
            }
            this._recalculateGraph();
        };
        this.removeOption = function(symbol) {
            if (this._options[symbol]) {
                this._options[symbol] = this._options[symbol] - 1;
            } else {
                this._options[symbol] = -1;
            }
            this._recalculateGraph();
        };
        this._getXRange = function(numIntervals, multiplyer) {
            var multiplyer = multiplyer || 1.2;
            var numIntervals = numIntervals || 10;
            var max = 0;
            var range = [];

            Object.keys(this._options).forEach(function(optKey) {
                if (jsonData[optKey].strike > max) {
                    max = jsonData[optKey].strike;
                }
            });
            max = 1.2*max;
            for (var i = 0; i < numIntervals; i++) {
                range[i] = max/numIntervals*i;
            }
            return range;
        };
        this._recalculateGraph = function() {
            var range = this._getXRange();
            var profits = range.map(this._pnlFunction.bind(this));
            OptionPlot.scale.xLabels = range;
            OptionPlot.datasets[0].points.forEach(function(point, i) {
                point.value = profits[i];
            });
            OptionPlot.update();
        };
        this._pnlFunction = function(underlyingPrice) {
            // given an underlying price, this function returns the pnl of the current OptionBasket
            var pnl = 0;

            Object.keys(this._options).forEach(function(optionKey) {
                var qty = this._options[optionKey];
                var optionType = jsonData[optionKey].option_type;
                //lookup by symbol what the strike price is
                var strike = jsonData[optionKey].strike;
                if (optionType === 'call') {
                    var profit = qty * Math.max(0,underlyingPrice - strike);
                } else {
                    var profit = qty * Math.max(0,strike - underlyingPrice); //todo
                }
                pnl = pnl + profit;
            }.bind(this));
            return pnl;
        }
    }

    function tableClick(e) {
        if (e.currentTarget.classList.contains('call-buy')){
            callBuy(e.currentTarget);
        } else if(e.currentTarget.classList.contains('call-sell')){
            callSell(e.currentTarget);
        } else if (e.currentTarget.classList.contains('put-buy')){
            putBuy(e.currentTarget);
        } else if (e.currentTarget.classList.contains('put-sell')){
            putSell(e.currentTarget);
        }
    }

    function getSiblingQtyNode(el) {
        var $row = $(el).parents('tr');
        return $row.find('.qty');
    }

    function callBuy(el) {
        var $el = $(el);
        var $qty = getSiblingQtyNode(el);
        var qty = parseInt($qty.text());
        $qty.text(qty + 1);

        Basket.addOption($el.data('id'));
    }

    function putBuy(el) {
        var $el = $(el);
        var $qty = getSiblingQtyNode(el);
        var qty = parseInt($qty.text());
        $qty.text(qty + 1);

        Basket.addOption($el.data('id'));
    }

    function callSell(el) {
        var $el = $(el);
        var $qty = getSiblingQtyNode(el);
        var qty = parseInt($qty.text());
        $qty.text(qty - 1);

        Basket.removeOption($el.data('id'));
    }

    function putSell(el) {
        var $el = $(el);
        var $qty = getSiblingQtyNode(el);
        var qty = parseInt($qty.text());
        $qty.text(qty - 1);

        Basket.removeOption($el.data('id'));
    }
}());
