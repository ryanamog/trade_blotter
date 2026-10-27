# trade_blotter
TPCIAP Take Home Assessment

/-----------------------------/
/ Architecture decisions      /
/-----------------------------/
1) Choice of Primary Database

Context
The Trade Blotter backend infrastructure for a small trading platform. The system must be able to handle high-volume trading logs. It should also be able to keep audit logs per trade transaction.

Options
- MongoDB
- MySQL

Decision
- We will use MySQL as our application database

Decision Drivers
- Relational nature of data (Books → Traders → Instruments → Counterparties → Trades → Audit Logs).
- Familiarity with SQL syntax, indexing, and triggers.

2) Choice of Backend API

Context
The Trade Blotter backend API serves as the link between the database and the frontend. It will serve as a central ledger for all trade transactions and provide real-time and historical view of trades.

Options
- NodeJS 

Decision
We will use NodeJs

Decision Drivers
- Node.js uses a single-threaded event loop paired with an asynchronous I/O pool.
- Native WebSocket Support (Real-Time Push)
- Rich, Lightweight Ecosystem (npm)

3) Choice of Front end

Context
The Trade Blotter frontend serves as a dashboard for brokers. From this dashboard a user can create, amend, cancel and view trades in realtime.

Options
- React + Typescript

Decision
- We will use React + Typescript

Decision Drivers
- Flawless Synchronization with Modern Backend API
- Catching Bugs Before Code Runs

/-----------------------------/
/ Installation Guide          /
/-----------------------------/

Set up the Database (MySQL)
- I'm using xampp - phpMyAdmin. On your browser got to "http://localhost/phpmyadmin/"
- Select "New" to create a database. Enter your desired database name. 
- Select the new database. Then on the tabs on top select "Import".
- On the File to import - Choose File and upload the "trade.sql" this will setup the tables
- To complete the setup go to the table "trade_users" and change the username to a valid email address. This email will be receiving the OTP for login.


Set up the Backend (Node JS)
- Go to project folder
  ~ cd path_to_project\trade

- Reinstall modules
  ~ npm install

- Setup .env file assign PORT where the API will run, Database Credentials, SMTP Credentials and JWT Token
(Note: SMTP is required because the app uses 2 factor authentication. The OTP will be sent to the registered user's email)
  ~ edit .env

- Run the server.js
  ~ cd path_to_project\trade
  ~ node server.js

Set up the Frontend (React + Typescript)
- Go to project folder
  ~ cd path_to_project\trader-by-night

- Reinstall modules
  ~ npm install

- Setup env.ts assign the API_URL (Back End)
  ~ cd  src\config\
  ~ edit env.ts

- Run the app
  ~ cd  path_to_project\trader-by-night
  ~ npm run dev

/-----------------------------/
/ Web Login                   /
/-----------------------------/
username: (use the email you assigned in the Database)
password: WoW@2026!

/-----------------------------/
/ Functional Requirements Done/
/-----------------------------/

Trade Blotter (Sorting, Basic filtering, Refresh data from API)
Create Trade
Amend Trade
Cancel Trade

Live Update
-Server-Sent Events

/-----------------------------/
/ Bonus Ideas                 /
/-----------------------------/
- Audit Trail (mysql table "trade_audit". This will show create, amend and cancel trades)
- User Authentication (uses 2 factor authentication. OTP sent to email address)
- Trade Validation (form validation accepts only valid values)
