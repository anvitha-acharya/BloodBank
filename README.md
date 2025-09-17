# BLOODBANK - Blockchain Based Blood Donation Tracking System

## Steps to run it on your system

### 1. Clone the repo
```
git clone https://github.com/anvitha-acharya/BloodBank.git
cd BloodBank
```
### 2. Install Dependencies
```
npm install
```
### 3. Start ganache
```
ganache-cli
```
Note down the RPC address and the account and their keys in a separate file

### 4.Compile and deploy contracts
```
truffle compile
truffle migrate --reset
```
Replace `contractAddress` in index.html and app.js with the new contract address everytime you compile.

### 5. Start backend
```
node server.js
```

### 6. Serve Frontend
```
http-server public
```

## MetaMask Connection

1. Install Metamask as Chrome Extension and create an account.
2. On running the application, click on the MetaMask icon -> Menu icon -> Networks -> Add a custom Network
3. Name the network as 'Localhost 8545', Default RPC URL : whatever RPC address you have noted (usually it is 127.0.1:8545), Chain ID: 1337, Currency symbol : ETH.
4. Create new accounts using the private keys noted before. Add Accounts -> Private Key. Make sure the network is set to Localhost 8545.
