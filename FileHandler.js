const fs = require("fs");
const path = require("path");
const pdf = require("pdfkit");

class FileHandler {
  static logTransaction(data, logFile = "transactions.csv") {
    const logPath = path.join(__dirname, logFile);

    const { userId, utilityType, amount, dueDate } = data;
    const transactionDate = new Date().toISOString();
    const csvData = `${userId},${utilityType},${amount},${dueDate},${transactionDate}\n`;

    if (!fs.existsSync(logPath)) {
      fs.writeFileSync(
        logPath,
        "UserID,UtilityType,Amount,DueDate,TransactionDate\n"
      );
    }
    fs.appendFileSync(logPath, csvData);
  }

  static generateInvoice(paymentDetails) {
    const invoiceId = paymentDetails.userId;
    const pdfFilePath = path.join(
      __dirname,
      "invoices",
      `invoice_${invoiceId}.pdf`
    );

    if (!fs.existsSync(path.join(__dirname, "invoices"))) {
      fs.mkdirSync(path.join(__dirname, "invoices"));
    }

    const doc = new pdf();
    doc.pipe(fs.createWriteStream(pdfFilePath));
    doc.text("Invoice", { align: "center" });
    doc.text(`UserID: ${paymentDetails.userId}`);
    doc.text(`Utility Type: ${paymentDetails.utilityType}`);
    doc.text(`Amount: ${paymentDetails.amount}`);
    doc.text(`Due Date: ${paymentDetails.dueDate}`);
    doc.text("Payment Successfully");
    doc.end();
  }

  static checkFileExists(filePath) {
    return fs.existsSync(filePath);
  }

  static downloadInvoice(filePath, res) {
    res.download(filePath, (err) => {
      if (err) {
        console.error("Error downloading the invoice:", err);
        res.status(500).send("Could not download the file.");
      }
    });
  }
}

module.exports = FileHandler;
