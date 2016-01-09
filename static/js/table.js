(function() {
    tables = document.getElementsByTagName('table');
    for (var i = 0; i < tables.length; i++) {
        tables[i].addEventListener('click', tableClick);
    }

    function tableClick(e) {
        if (e.target.classList.indexOf('call-buy') !== -1){
            callBuy(e.target);
        } else if(e.target.classList.indexOf('put-buy') !== -1){
            putBuy(e.target);
        }
    }

    function callBuy(el){
        var qtyNode = el.parentElement.nextSibling;
        var qty = qtyNode.innerHTML;

        qtyNode.innerHTML = ++qty;
    }

}());
