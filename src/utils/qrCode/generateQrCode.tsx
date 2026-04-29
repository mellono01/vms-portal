"use server"

import QRCode from 'qrcode';

interface QrData {
  FirstName: string,
  LastName: string,
  PhoneNumber: string,
  EmployeeNumber: string,
  CedowToken: string,
  Organisation: string,
  ReasonForVisit: string,
}

export default async function generateQrCode(qrData: QrData): Promise<string | undefined> {
  try {
    const qrCodeData = await QRCode.toDataURL(
      JSON.stringify(qrData), 
      {
        errorCorrectionLevel: 'L',
        width: 200,
        margin: 0,
      }
    );
    if(qrCodeData && isValidDataUrl(qrCodeData)) {
      return qrCodeData;
    } else {
      console.error('Invalid QR code data URL generated');
      return undefined;
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    return undefined;
  }
}

// Utility function to validate data URL
const isValidDataUrl = (url: string): boolean => {
  try {
    // Check if it's a valid data URL with image type
    const dataUrlPattern = /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/;
    return dataUrlPattern.test(url);
  } catch {
    return false;
  }
};