from flask import Flask, render_template, request
import httplib
import pprint
import json

pp = pprint.PrettyPrinter(indent=4)
app = Flask(__name__)

@app.route('/')
def hello_world():
    return getChain()

# variable route to quote a symbol

@app.route('/index/', methods=['GET','POST'])
def getChain():
    if request.method == 'GET':
        return render_template('index.html')

    symbol = request.form['symbol']
    # set up the https connection with Tradier API
    connection = httplib.HTTPSConnection('sandbox.tradier.com', 443, timeout = 30)
    # build headers to deliver to Tradier
    headers = {"Accept":"application/json", "Authorization":"Bearer NrGhOFZHuGFdVtIzcwyRULgxjRFJ"}
    # send request to connection
    dates = getExpirations(symbol)
    url = '/v1/markets/options/chains?symbol=%(symbol)s&expiration=%(date)s' % {"symbol": symbol, "date": dates[0]}
    connection.request('GET', url, None, headers)

    try:
        response = connection.getresponse().read()
        jsonQuote = json.loads(response)
        contractsList = sorted(jsonQuote['options']['option'], key=lambda contract: contract['strike'])
        putsChain = [x for x in contractsList if x['option_type'] == "put"]
        callChain = [x for x in contractsList if x['option_type'] == "call"]
        return render_template('index.html', putChain=putsChain, callChain=callChain, JSONData=contractsList)
    except httplib.HTTPException, e:
        print('Exception during request')

def getExpirations(symbol):
    # set up the https connection with Tradier API
    connection = httplib.HTTPSConnection('sandbox.tradier.com', 443, timeout = 30)
    # build headers to deliver to Tradier
    headers = {"Accept":"application/json", "Authorization":"Bearer NrGhOFZHuGFdVtIzcwyRULgxjRFJ"}
    # send request to connection
    url = '/v1/markets/options/expirations?symbol=%s' % symbol
    connection.request('GET', url, None, headers)

    try:
        response = connection.getresponse()
        jsonQuote = json.loads(response.read())
        return jsonQuote['expirations']['date']
    except httplib.HTTPException, e:
        print('Exception during request')

if __name__ == '__main__':
    app.run(debug=True)

