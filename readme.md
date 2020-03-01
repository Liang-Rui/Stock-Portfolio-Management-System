##### Demo:  www.youtube.com/watch?v=7LpReUvbZiE&t=13s
This project aims at developing a high performance cross-platform responsive application for stock portfolio management.  

#### Key features

- [x] Registration
- [x] Statistics Panel
- [x] User Profile
- [x] Authentication
- [x] Administration
- [x] Fuzzy Stock Search
- [x] Interactive Pie Charts, Line Graphs for portfolio management console
- [x] Stock Holding List
- [x] Interactive Candlestick Chart for stock detail view
- [x] News Feed
- [x] Stock Price Prediction
- [x] Factor Analysis for stock recommendation

### 1. Major system requirements

* MacOS
* Python >= 3.6
* npm
* node
* redis
* Homebrew
* Chrome web browser

### 2. System setup

#### Setup database

First you need to download the databases for our project, **make sure the project folder is on the desktop on your mac** because the command I use assumes  you have put the project on the desktop.

1. Download `db.sqlite3` from "https://drive.google.com/open?id=1lGICmbDGhoVapLBg-pnXoCA-cYAGcjhH" and `stockDB.zip` from "https://drive.google.com/open?id=1QKZbwWsxqr1iQ9Ht9bQOqqka_lSNp2Nu"  in share google drive and then put them in `project/backend/src` folder, unzip `stockDB.zip` into that directory.

2. Download `node_modules.zip` from share google drive "https://drive.google.com/open?id=1NGG4-y6Y4K_Sud-ovLI7nBpDPbcW2SUl" and then put it in `project/frontend` folder, unzip `node_modules.zip` into that directory.
3. Download `stock_ml.zip` from share google drive "https://drive.google.com/open?id=1mgtLtxOHt5YXAriqupscx3J51N7TIew5" and then put it in `project` folder, unzip `stock_ml.zip` into that directory.



#### Setup backend server

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



#### Setup frontend server

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

After system setup, you can go to homepage `http://localhost:3000/` and click the video to see the short demo of some features.

### 3. User administration features

#### (3.1) Register

In order to register, user need to click `login` button on the upper right corner, then click `DON'T HAVE AN ACCOUNT?SIGN UP`. 

![Screen Shot 2019-11-23 at 2.08.07 pm](https://i.imgur.com/9j1Sd7Q.jpg)

![Screen Shot 2019-11-23 at 2.09.14 pm](https://i.imgur.com/Z28KLYV.jpg)

Then for example input the user name as `testuser`, email as `testuser@gmail.com` and password `testuser`:

![Screen Shot 2019-11-23 at 2.13.03 pm](https://i.imgur.com/cTgcKhA.jpg)

#### (3.2) User profile

After sign up, system will automatically login. You can see the user profile by expanding the left drawer and select `My Account`:

![Screen Shot 2019-11-23 at 2.15.05 pm](https://i.imgur.com/u04tmaH.png)

![Screen Shot 2019-11-23 at 2.15.27 pm](https://i.imgur.com/wDRaXb8.png)

![Screen Shot 2019-11-23 at 2.15.55 pm](https://i.imgur.com/LUyS6Vn.png)

Now you can change the user profile by editing it.

#### (3.3) Admin page

In order to login to admin page, you need to make sure you have already create a superuser using `django`. Then you can go to `http://127.0.0.1:8000/admin/`. We have already create a superuser for you: user name is `liangrui` and password is `liangrui`.

![Screen Shot 2019-11-23 at 2.22.29 pm](https://i.imgur.com/Lpx2Npt.jpg)

![Screen Shot 2019-11-23 at 2.23.01 pm](https://i.imgur.com/vZ2gLtj.jpg)

After login to admin page, you can see all the database data and edit them. **Note that editing the database is dangerous! Which will cause inconsistent issues!**



### 4. Portfolio management console

In order to see the portfolio management console, you need to expand the left side drawer, then select `My Portfolio`, you can see that at the very beginning, there is nothing there.

![Screen Shot 2019-11-23 at 2.35.49 pm](https://i.imgur.com/zimsM1w.jpg)

![Screen Shot 2019-11-23 at 2.36.59 pm](https://i.imgur.com/lczeXoA.jpg)

#### (4.1) Add stock to holding list

In order to add stock to holding list, there are two methods that you can use:

* Add the symbol in the holding list table, but in this case, you need to make sure the symbol should appear in the database.

![Screen Shot 2019-11-23 at 2.38.24 pm](https://i.imgur.com/O0E30cS.jpg)

* Add the symbol in the complete stock list (the complete stock list is in the home page, you can go home using either of the following two methods)

![Screen Shot 2019-11-23 at 2.55.20 pm](https://i.imgur.com/7irRQRR.jpg)

![Screen Shot 2019-11-23 at 2.55.53 pm](https://i.imgur.com/8CCHIwE.jpg)

After go home, you can scroll down the list and add the symbol using the `+` sign in front of the symbol.

![Screen Shot 2019-11-23 at 3.00.36 pm](https://i.imgur.com/uE8AOd3.jpg)

#### (4.2) Delete a stock in the holding list

Deleting a symbol is straightforward, you can simply click the bin button.

![Screen Shot 2019-11-23 at 3.14.35 pm](https://i.imgur.com/BqpV2t7.jpg)

#### (4.3) Add/delete/edit a transaction

In order to add a transaction, you need to click the row to activate current transaction. For example, if we want to add transaction to symbol `AAPL`, then we need to place the mouse within the following mouse position in the red square area and left click the mouse.

![Screen Shot 2019-11-23 at 3.20.55 pm](https://i.imgur.com/zXTetpL.jpg)

Then the current trading will show the `AAPL` symbol table list which indicates the current trading is activated for `AAPL`. If you want to add a transaction, you need to click the `+` sign and input the data. **Important! Note that our database have only been inserted data before 2019/10/31, so that you can only insert transaction data before that!**

![Screen Shot 2019-11-23 at 3.40.59 pm](https://i.imgur.com/JYuc4cI.jpg)

After that, you can see the current stock performance chart on the right hand side. You can also delete and edit the transaction as the figure indicates.

![Screen Shot 2019-11-23 at 3.45.25 pm](https://i.imgur.com/OF87p86.jpg)

#### (4.4) Portfolio charts

The portfolio performance is shown using the statistical panel, radar chart, pie chart and composed chart. 

* The statistics panel shows the total portfolio value, total gain and daily gain. 

* The radar chart shows the stocks in the holding list comparing with each other in range 0 to 1, for example, if `AAPL` has market value 100 and `AAL` has market value 200, then in the market value dimension, `AAPL` will be $\frac{100}{100+200}=0.333$.  
* The pie chart shows the proportion of market value of each stock. 
* The composed chart shows the portfolio total gain, total market value and daily gain.

![Screen Shot 2019-11-23 at 3.50.39 pm](https://i.imgur.com/qT2KaUR.jpg)

You can also drag the grey bar below the composed chart to shrunk the range. 

![Screen Shot 2019-11-23 at 4.15.15 pm](https://i.imgur.com/CV31TWk.jpg)

You can also see each stock performance by expanding the row.

![Screen Shot 2019-11-23 at 4.17.15 pm](https://i.imgur.com/I5127dJ.jpg)

### 5. Stock search

You can search a stock by entering the stock symbol name or company name in the search bar on complete stock list in homepage.

![Screen Shot 2019-11-23 at 4.20.51 pm](https://i.imgur.com/unSRSbv.jpg)

### 6. Stock detail information

You can see stock detail by clicking the small icon on each row of the symbol list as follows:

![Screen Shot 2019-11-23 at 4.23.51 pm](https://i.imgur.com/DiyQLRk.jpg)

#### (6.1) Stock detail chart

Then you can see the stock detail chart when scrolling down the page. You can shrink the chart by clicking the `-` icon and zoom by clicking the `+` icon, you can also reset the position by clicking the reset icon. The statistics is shown on the upper left corner of the chart and the technical indicators are shown on the bottom of the detail chart.

![Screen Shot 2019-11-23 at 4.25.38 pm](https://i.imgur.com/2bs7rs5.jpg)

#### (6.2) Stock news feed

You can see the stock news when scrolling down the page, and you can also search news by entering the keywords in the search bar.

![Screen Shot 2019-11-23 at 4.25.48 pm](https://i.imgur.com/P6fXKIs.jpg)

### 7. Stock price prediction

The stock price prediction section is in the same page as the stock detail page, you can see the future prediction on the first chart, the grey and blue area shows the confidence region which means the upper bound and lower bound of the price prediction. The red line is the actual stock price, the blue line the predicted price.

![Screen Shot 2019-11-23 at 4.30.23 pm](https://i.imgur.com/xbu259D.jpg)

We also shows the in-sample error and out-sample error of the model, the model is better when R2 score is close to 1, the mean square error is close to 0.

![Screen Shot 2019-11-23 at 4.33.51 pm](https://i.imgur.com/oGhbVH3.jpg)

### 8. Factor analysis and stock recommendation

We use Fama-French three factor model to rank the stock and choose the top 10 stock to recommend to users, you can see the recommended stock when go to homepage and scroll down to the bottom.

![Screen Shot 2019-11-23 at 4.37.27 pm](https://i.imgur.com/Mo0VHDR.jpg)





