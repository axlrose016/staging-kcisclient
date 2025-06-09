"use client"
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

type SuccessPageProps = {
  first_name: string;
  email: string;
  email_subject: string;
  email_body: string;
};
import LoginService from "@/app/login/LoginService";
export default function SuccessPage({
  first_name,
  email,
  email_subject,
  email_body,
}: SuccessPageProps) {
  const sendAnEmailConfirmation = () => {
    // Implement actual email logic here
    console.log(`Email sent to ${email}: ${email_subject} - ${email_body}`);
  };
  const sendEmail = async (first_name: any, email: any, email_subject: any, email_body: any) => {

    // const res = await fetch('/api/send-email', {
    //   method: 'POST',
    //   // body: JSON.stringify({ first_name, email, email_subject, email_body }),
    //   body: JSON.stringify({ first_name, email, email_subject, email_body }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    const sendEmailConfirmation = async (endpoint: string) => {

      try {
        debugger;
        const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `bearer ${onlinePayload.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "email": email,
            "subject": "KC IS CFW Module Beneficiary Registration",
            "body": `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">          
                  <p>Dear ${first_name.toUpperCase()},</p>
                  <p>${email_body}</p>        
                  <p>Best regards,</p>
                  <p>KALAHI-CIDSS-CFWP </p>
                </div>
                `,
            "cc": process.env.EMAIL_CC + ",jmgarbo@dswd.gov.ph,argvillanueva@dswd.gov.ph",
            "bcc": "dsentico@dswd.gov.ph",
            //            email:pcpborja@dswd.gov.ph,
            // subject:test,
            // body:test,
            // cc:paulclarenceit@gmail.com,
            // bcc:paulclrenceit2@gmail.com,
            // cc:jmgarbo@dswd.gov.ph,
            // cc:argvillanueva@dswd.gov.ph,

          })
        });

        if (!response.ok) {
          console.log(response);
        } else {
          const data = await response.json();
          console.log("🗣️Person Profile masterlist from api ", data.data);

        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Request canceled", error.message);
          alert("Request canceled" + error.message);
        } else {
          console.error("Error fetching data:", error);
          alert("Error fetching data:" + error);
        }
      }
    };
    // https://kcnfms.dswd.gov.ph/kcis/api/send_email/create/
    sendEmailConfirmation(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "send_email/create/");
    // const res = await 

    // const data = await res.json();

  };
  useEffect(() => {
    const ls = localStorage.getItem("sendEmailData")
    if (ls) {
      const parsedData = JSON.parse(ls);

      sendEmail(parsedData.first_name, parsedData.email, "CFW Beneficiary Profiling", "Your registration has been submitted successfully.");
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Success!</h1>
      <p className="text-lg mb-6">
        Thank you, <span className="font-semibold">{first_name}</span>. Your registration has been submitted successfully.
      </p>
      <Button onClick={sendAnEmailConfirmation}>Confirm</Button>
    </div>
  );
}
