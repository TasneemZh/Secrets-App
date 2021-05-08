HTML + CSS + Bootstrap + JavaScript + EJS + MongoDB + Node.js + Express + Security features *such as* cookies, anonymity, and hashing

You can use **Robo 3T** instead of the hyper terminal `mongo` to interact with the databases in the GUI approach rather than the CLI one

NOTE: Make sure to connect to the **Robo 3T** properly in order to reach your local databases

-----------------

### To change the *client ID* and *client secret ID* for **Google** API, do the following:

1- Enter the [Google Developers](https://console.cloud.google.com/apis/dashboard) website

2- Create an account, and log in with it

3- Go to *Credentials*, and click on your app name after you create it

4- Copy the *Client ID* and *Client Secret* which appears on the above right side of the screen

5- Substitute the values in the project with yours

### To change the *client ID* and *client secret ID* for **Facebook** API, do the following:

1- Enter the [Facebook Developers](https://developers.facebook.com/) website

2- Create an account, and log in with it

3- Go to *My Apps*, and click on your app name after you create it

4- Go to *Settings*/*Basic*, and copy the *App ID* and *App Secret* which appears in the first line in the settings.

5- Substitute the values in the project with yours

-----------------

1- Use the HyperTerminal to enter the server by:

NOTE: **don't do the first bulleted step if you have installed nodemon before**

- Installing nodemon by typing `npm install -g nodemon` (Wherever you want^^)

- Moving to the directory where you cloned the project (Use cd)

- Typing `nodemon (app.js)`

NOTE: Specifying *app.js* after *nodemon* is **optional** since it is determined to be the main file in *package.JSON*

2 - Enter the URL: http://localhost:3000/

-----------------

For more reading, see:

- [passport-google-oauth2.0](http://www.passportjs.org/packages/passport-google-oauth20/)

- [passport-facebook](http://www.passportjs.org/packages/passport-facebook/)

Also, download [Robo 3T](https://robomongo.org/download)
