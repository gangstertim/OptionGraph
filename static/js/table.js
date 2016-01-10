$(function() {
    $('table').on('click', 'button', tableClick);
    
    var graphData = {
        labels : ["January", "February", "March", "April", "May"],
        datasets : [
            {
                label: "My First Dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [5,5,5,5,5]
            }
        ]
    }

    var ctx = document.getElementById("myChart").getContext("2d");
    var OptionPlot = new Chart(ctx).Line(graphData,{
        bezierCurve: false,
        responsive: true
    });

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
            OptionPlot.scale.xLabels = this._getXRange();
            OptionPlot.update();
            // var max = max price in strike price list
        };
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

    function callSell(el) {
        var $el = $(el);
        var $qty = getSiblingQtyNode(el);
        var qty = parseInt($qty.text());
        $qty.text(qty - 1);

        Basket.removeOption($el.data('id'));
    }
}());