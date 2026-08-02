import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { FoodItem, PickupRequest } from '../types';

export async function generateDonationReceiptPDF(
  foodItem: FoodItem,
  pickup: PickupRequest
): Promise<void> {
  const doc = new jsPDF();

  // Color theme
  const emeraldGreen = '#059669';
  const darkNavy = '#0f172a';

  // Title Banner
  doc.setFillColor(5, 150, 105);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('FoodLink AI - Official Donation Receipt', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Reducing Food Waste • Feeding Communities', 14, 27);

  // Receipt Metadata
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Receipt ID: FLK-${pickup.id.substring(0, 8).toUpperCase()}`, 14, 45);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 14, 52);
  doc.text(`Tracking Ref: ${pickup.trackingNumber}`, 14, 58);

  // Line Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 63, 196, 63);

  // Donor & Recipient Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Donor Organization (Restaurant/Hotel)', 14, 73);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Name: ${pickup.restaurantName}`, 14, 80);
  doc.text(`Address: ${pickup.restaurantAddress}`, 14, 86);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. Recipient Organization (NGO/Food Bank)', 110, 73);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Name: ${pickup.ngoName}`, 110, 80);
  doc.text(`Address: ${pickup.ngoAddress}`, 110, 86);

  // Line Divider
  doc.line(14, 94, 196, 94);

  // Food Item Summary Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3. Surplus Food Details', 14, 104);

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 109, 182, 10, 'F');
  doc.setFontSize(9);
  doc.text('Item Description', 18, 115);
  doc.text('Category', 85, 115);
  doc.text('Quantity', 125, 115);
  doc.text('Condition', 165, 115);

  // Table Content
  doc.setFont('helvetica', 'normal');
  doc.text(foodItem.foodName, 18, 126);
  doc.text(foodItem.category, 85, 126);
  doc.text(`${foodItem.quantity} ${foodItem.quantityUnit}`, 125, 126);
  doc.text(foodItem.foodCondition, 165, 126);

  doc.line(14, 132, 196, 132);

  // Impact Section
  doc.setFillColor(236, 253, 245);
  doc.rect(14, 140, 182, 28, 'F');
  doc.setDrawColor(5, 150, 105);
  doc.rect(14, 140, 182, 28, 'S');

  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Environmental & Community Impact Statement', 20, 148);

  const meals = Math.round(foodItem.quantity * 2.2);
  const co2 = Math.round(foodItem.quantity * 2.5 * 10) / 10;
  const water = Math.round(foodItem.quantity * 950);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    `• Meals Provided: ${meals} meals   • CO2 Emissions Saved: ${co2} kg CO2e   • Water Saved: ${water.toLocaleString()} Liters`,
    20,
    158
  );

  // QR Code Verification
  const qrDataUrl = await QRCode.toDataURL(
    JSON.stringify({
      receiptId: pickup.id,
      verificationCode: pickup.qrVerificationCode,
      restaurant: pickup.restaurantName,
      ngo: pickup.ngoName,
      qty: `${foodItem.quantity} ${foodItem.quantityUnit}`
    })
  );

  doc.addImage(qrDataUrl, 'PNG', 14, 178, 36, 36);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Verification QR Code', 55, 186);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Code: ${pickup.qrVerificationCode}`, 55, 193);
  doc.text('Scan using FoodLink mobile or partner app to verify pickup authenticity.', 55, 199);
  doc.text('Tax Deductible Gift / Donation Receipt per Food Recovery Act.', 55, 205);

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 270, 196, 270);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'FoodLink AI Platform • Verified Digital Receipt • https://foodlink-ai.org',
    14,
    276
  );

  // Save PDF
  doc.save(`FoodLink_Donation_Receipt_${pickup.id.substring(0, 6)}.pdf`);
}
