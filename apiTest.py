import httplib

connection = httplib.HTTPSConnection('sandbox.tradier.com', 443, timeout = 30)

headers = {"Accept":"application/json", "Authorization":"Bearer NrGhOFZHuGFdVtIzcwyRULgxjRFJ"}

connection.request('GET', '/v1/markets/options/expirations?symbol=msft', None, headers)
try:
    response = connection.getresponse()
    content = response.read()
    print('Response status ' + str(response.status))
    responseHeaders = response.getheaders()
    print responseHeaders
    print content
except httplib.HTTPException, e:
    print('Exception during request')

