import jsPDF from 'jspdf';
import { Transaction } from './bankingContext';

export function generateReceipt(transaction: Transaction, userName: string) {
  const doc = new jsPDF();
  
  // Header with gradient background simulation
  doc.setFillColor(33, 91, 226);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Logo/Bank name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('SUKH SECURE BANK', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Transaction Receipt', 105, 30, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Receipt details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Transaction Receipt', 20, 55);
  
  // Horizontal line
  doc.setDrawColor(33, 91, 226);
  doc.setLineWidth(0.5);
  doc.line(20, 60, 190, 60);
  
  // Transaction details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  let yPos = 75;
  const lineHeight = 10;
  
  const details = [
    { label: 'Transaction ID:', value: transaction.id },
    { label: 'Date & Time:', value: transaction.date.toLocaleString() },
    { label: 'Transaction Type:', value: transaction.type === 'debit' ? 'Money Sent' : 'Money Received' },
    { label: 'Amount:', value: `₹${transaction.amount.toLocaleString('en-IN')}` },
    { label: transaction.type === 'debit' ? 'Recipient:' : 'Sender:', value: transaction.recipient },
    { label: 'Account:', value: transaction.recipientAccount },
    { label: 'Category:', value: transaction.category },
    { label: 'Status:', value: transaction.status.toUpperCase() },
    { label: 'Safety Score:', value: `${transaction.safetyScore || 100}/100` }
  ];
  
  details.forEach(({ label, value }) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, yPos);
    yPos += lineHeight;
  });
  
  // Amount highlight box
  yPos += 10;
  doc.setFillColor(240, 253, 244);
  doc.rect(20, yPos - 5, 170, 20, 'F');
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.3);
  doc.rect(20, yPos - 5, 170, 20);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  const amountText = transaction.type === 'debit' ? 'Amount Debited:' : 'Amount Credited:';
  doc.text(amountText, 25, yPos + 5);
  doc.text(`₹${transaction.amount.toLocaleString('en-IN')}`, 165, yPos + 5, { align: 'right' });
  
  // Reset colors
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(0, 0, 0);
  
  yPos += 35;
  
  // Security notice
  doc.setFillColor(239, 246, 255);
  doc.rect(20, yPos, 170, 25, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('🔒 This is a digitally generated secure receipt.', 25, yPos + 8);
  doc.text('Transaction verified with 2FA and biometric authentication.', 25, yPos + 14);
  doc.text('For queries, contact: support@sukhbank.com | +91-1800-XXX-XXXX', 25, yPos + 20);
  
  // Footer
  yPos += 40;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('© 2025 Sukh Secure Bank. All rights reserved.', 105, yPos, { align: 'center' });
  doc.text('This document is generated electronically and does not require a signature.', 105, yPos + 5, { align: 'center' });
  
  // Security watermark
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(50);
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFIED', 105, 150, { 
    align: 'center',
    angle: 45,
  });
  
  // Save the PDF
  const fileName = `receipt_${transaction.id}_${Date.now()}.pdf`;
  doc.save(fileName);
}
