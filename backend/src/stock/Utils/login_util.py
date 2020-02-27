import requests


def isLogin(token):
    myToken = token
    myUrl = 'http://127.0.0.1:8000/api/auth/user'
    head = {'Authorization': 'token {}'.format(myToken)}
    response = requests.get(myUrl, headers=head)
    if response:
        return True
    else:
        return False


def getInfor(token):
    myToken = token
    myUrl = 'http://127.0.0.1:8000/api/auth/user'
    head = {'Authorization': 'token {}'.format(myToken)}
    response = requests.get(myUrl, headers=head)
    data = response.json()
    return data


def getKey(lastName):
    return "watchlist: " + lastName