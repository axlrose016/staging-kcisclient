// app/api/send-email/route.ts
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { first_name, email, email_subject, email_body } = await request.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  try {
    debugger;
    await transporter.sendMail({
      from: `"KC IS CFW Module" <${process.env.EMAIL_USERNAME}>`,
      // to: "dwightentico@gmail.com", 
      to: email, 
      cc: process.env.EMAIL_CC, // Add CC recipients from environment variable
      subject: email_subject,
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">          
        <p>Dear ${first_name.toUpperCase()},</p>
        <p>${email_body}</p>        
        <p>Best regards,</p>
        <p>KALAHI-CIDSS-CFWP </p>
      </div>
      `,
    });

    return NextResponse.json({ message: 'Email sent successfully!' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Error sending email', error: error.message }, { status: 500 });
  }
}

// Optional: reject other methods like GET
export function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
