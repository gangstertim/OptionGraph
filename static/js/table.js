$(function() {
    $('table').on('click', 'button', tableClick);

    var lineChartData = {
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
            },
            {
                label: "My Second Dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [5,5,5,5,5]
            }
        ]
    }
    var ctx = document.getElementById("myChart").getContext("2d");
    window.myLine = new Chart(ctx).Line(lineChartData,{
        bezierCurve: false,
        responsive: true
    });

    console.log(jsonData);

    var Basket = new OptionBasket();


    function OptionBasket() {
        this._options = {};
        this.addOption = function(symbol) {
            if (this._options[symbol]) {
                this._options[symbol] = this._options[symbol] + 1;
            } else {
                this._options[symbol] = 1;
            }

            console.log(this._options);
        };
        this.removeOption = function(symbol) {
            if (this._options[symbol]) {
                this._options[symbol] = this._options[symbol] - 1;
            } else {
                this._options[symbol] = -1;
            }
            console.log(this._options);
        };
        this.pnlFunction = function(underlyingPrice) {
            // given an underlying price, this function returns the pnl of the current OptionBasket
            pnl = 0;
            for (var optionKey in Object.keys(this._options)) {
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
            }
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
