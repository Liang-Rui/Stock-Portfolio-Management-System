import requests

# Check if user has login
# The input could be either a login token or register token
def getUserInfo(token):
    myToken = token
    myUrl = 'http://127.0.0.1:8000/api/auth/user'
    head = {'Authorization': 'token {}'.format(myToken)}
    response = requests.get(myUrl, headers=head)
    data = response.json()
    return data

def isUserlogin(token):
    myToken = token
    myUrl = 'http://127.0.0.1:8000/api/auth/user'
    head = {'Authorization': 'token {}'.format(myToken)}
    response = requests.get(myUrl, headers=head)
    if response:
        return True
    else:
        return False

def userLogout(token):
    myToken = token
    myUrl = 'http://127.0.0.1:8000/api/auth/logout'
    head = {'Authorization': 'token {}'.format(myToken)}
    requests.post(myUrl, headers=head)
    return


