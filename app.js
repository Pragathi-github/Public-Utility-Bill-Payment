const express = require("express");
const bodyParser = require("body-parser");
const PriorityQueue = require("./PriorityQueue");
const Stack = require("./Stack");
const FileHandler = require("./FileHandler");

const app = express();
app.use(bodyParser.json());

const paymentQueue = new PriorityQueue();
const transactionStack = new Stack();
const ALERT_THRESHOLD_DAYS = 2;

function checkNearDuePayments() {
  const currentDate = new Date();

  paymentQueue.items.forEach((payment) => {
    const dueDate = new Date(payment.dueDate);
    const timeDifference = dueDate - currentDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference <= ALERT_THRESHOLD_DAYS && !payment.processed) {
      console.log(
        `Alert: Payment for user ${payment.userId} (Utility: ${payment.utilityType}) is due in ${daysDifference} day(s). Please process soon.`
      );
    }
  });
}

setInterval(checkNearDuePayments, 60 * 60 * 1000);

app.post("/api/payment", (req, res) => {
  const { userId, utilityType, amount, dueDate, urgent } = req.body;

  const paymentDetails = {
    userId,
    utilityType,
    amount,
    dueDate,
    urgent: urgent || false,
    processed: false,
  };

  paymentQueue.enqueue(paymentDetails);
  FileHandler.logTransaction(paymentDetails);

  res
    .status(201)
    .json({ message: "Payment added to queue successfully.", paymentDetails });
});

app.get("/api/process-payments", async (req, res) => {
  const processedPayments = [];

  while (!paymentQueue.isEmpty()) {
    let paymentDetails = paymentQueue.dequeue();

    try {
      await processPayment(paymentDetails);
      transactionStack.push(paymentDetails);
      FileHandler.generateInvoice(paymentDetails);
      paymentDetails.processed = true;
      processedPayments.push(paymentDetails);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  }

  processedPayments.sort((a, b) => {
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  res.status(200).send({ message: "Processed payments", processedPayments });
});

app.get("/api/transaction/history", (req, res) => {
  if (transactionStack.isEmpty()) {
    return res
      .status(404)
      .json({ message: "No transaction history available." });
  }

  const history = transactionStack.getHistory();
  const formattedHistory = history.map((transaction, index) => ({
    [`Payment ${index + 1}`]: {
      userId: transaction.userId,
      utilityType: transaction.utilityType,
      amount: transaction.amount,
      dueDate: transaction.dueDate,
      priority: transaction.urgent ? "Urgent" : "Normal",
    },
  }));

  res.status(200).json({ history: formattedHistory });
});

app.post("/api/transaction/undo", (req, res) => {
  if (transactionStack.isEmpty()) {
    return res.status(404).json({ message: "No transaction to undo." });
  }

  const lastTransaction = transactionStack.pop();
  FileHandler.logTransaction(lastTransaction, "undo_transactions.csv");

  res.status(200).json({ message: "Last transaction undone", lastTransaction });
});

app.get("/api/invoice/status/:userId", (req, res) => {
  const userId = req.params.userId;
  const pdfPath = `./invoices/invoice_${userId}.pdf`;
  const csvPath = `./transactions.csv`;

  const pdfExists = FileHandler.checkFileExists(pdfPath);
  const csvExists = FileHandler.checkFileExists(csvPath);

  res.status(200).json({
    userId,
    invoiceStatus: {
      pdfGenerated: pdfExists,
      csvGenerated: csvExists,
    },
  });
});

app.get("/api/invoice/download/:userId", (req, res) => {
  const userId = req.params.userId;
  const filePath = `./invoices/invoice_${userId}.pdf`;

  FileHandler.downloadInvoice(filePath, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function processPayment(paymentDetails) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}
