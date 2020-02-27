##### Demo:  www.youtube.com/watch?v=7LpReUvbZiE&t=13s

## Major system requirements

* MacOS
* Python >= 3.6
* npm
* node
* redis
* Homebrew
* Chrome web browser

## Setup database

First you need to download the databases for our project, **make sure the project folder is on the desktop on your mac** because the command I use assumes  you have put the project on the desktop.

1. Download `db.sqlite3` from "https://drive.google.com/open?id=1lGICmbDGhoVapLBg-pnXoCA-cYAGcjhH" and `stockDB.zip` from "https://drive.google.com/open?id=1QKZbwWsxqr1iQ9Ht9bQOqqka_lSNp2Nu"  in share google drive and then put them in `project/backend/src` folder, unzip `stockDB.zip` into that directory.

2. Download `node_modules.zip` from share google drive "https://drive.google.com/open?id=1NGG4-y6Y4K_Sud-ovLI7nBpDPbcW2SUl" and then put it in `project/frontend` folder, unzip `node_modules.zip` into that directory.
3. Download `stock_ml.zip` from share google drive "https://drive.google.com/open?id=1mgtLtxOHt5YXAriqupscx3J51N7TIew5" and then put it in `project` folder, unzip `stock_ml.zip` into that directory.



## Setup backend server

1. First we need to install `homebrew` on mac, open your mac `terminal` and input the following command (since the pdf file cannot display the full length of the command, you can either type each character in the terminal or open readme.md file on the project root folder and copy the text):

```shell
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

During installation you need to press `enter` and may need to enter your mac login password.

2. Then we need to setup `redis` cache server. Type the following command:

```shell
brew install redis
```

3. After that, start `redis` server:

```shell
redis-server /usr/local/etc/redis.conf
```

When the server is running, **do not close the terminal window!**

4. Then open **another terminal**, you need to use `homebrew` to install `python3` in the terminal:

```shell
brew install python3
```

After installation, check the python version using the following command:

```shell
python3 --version
```

which give you

```
Python 3.7.4 or some version >= 3.6
```

Then check whether you are using the correct python package from homebrew (this is required because if you have install anaconda then the default python will be using anaconda rather than homebrew):

```shell
which python3
```

which should give you

```
/usr/local/bin/python3
```


5. Now you can use `pip3` to install `virtualenv` to setup virtual environment:

```shell
/usr/local/bin/pip3 install virtualenv
```

6. Then go to `project/backend` folder, and setup virtual environment:

```shell
cd ~/Desktop/project/backend
/usr/local/bin/virtualenv -p /usr/local/bin/python3 env
```

7. Activate virtual environment:

```shell
source env/bin/activate
```

Now you can type the following command to check whether you have activated successfully:

```shell
which pip3
which python3
```

which gives

```
.../project/backend/env/bin/pip3
.../project/backend/env/bin/python3
```

`...` means your upper folder directory.

8. Then you need to install python packages using the following command:

```shell
pip3 install -r requirements.txt
```



9. After all the packages are installed, you can start the server in the `project/backend/src` folder:

```shell
cd ~/Desktop/project/backend/src
python3 manage.py runserver
```

When the server is running, **do not close the terminal window！** 



## Setup frontend server

1. Now we need to open **another terminal window**, and install `node js` and `npm`:

```shell
brew install node
```

2. Then go to frontend directory and start frontend server:

```shell
cd ~/Desktop/project/frontend
npm start
```

Now you can see the application is running on `localhost:3000`. Note that the default size of fronts in different computer may vary, in order to have better user experience, we recommend that you can shrink your browser to 90% using the following command: `command` + `-` key on your keyboard.

If there are any issues, please email me: `liangrui00@gmail.com` or `rui.liang1@student.unsw.edu.au`, or you can text me or call me using `0451238789`.

