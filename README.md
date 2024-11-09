# Public-utility-bill-payment
##npm install express body-parser fs pdfkit
##node app.js

#In postman or thunderclient
##URL: http://localhost:3000/api/payment
Method: POST

{
  "userId": "12345",
  "utilityType": "Electricity",
  "amount": "150.00",
  "dueDate": "2024-10-15",
  "urgent": true
}

GET Process Payments

URL: http://localhost:3000/api/process-payments
Method: GET

GET Transaction History

URL: http://localhost:3000/api/transaction/history
Method: GET

POST Undo Last Transaction

URL: http://localhost:3000/api/transaction/undo
Method: POST

GET Invoice Status

URL: http://localhost:3000/api/invoice/status/303741
Method: GET

GET Download Invoice

URL: http://localhost:3000/api/invoice/download/303741
Method: GET
