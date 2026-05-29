import { Resend } from "resend";
import { reportReadyEmailHtml, reportReadyEmailSubject } from "./report-ready-email";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  return new Resend(key);
}

export interface SendReportReadyEmailParams {
  to: string;
  cityAName: string;
  cityBName: string;
  reportUrl: string;
}

export async function sendReportReadyEmail(
  params: SendReportReadyEmailParams,
): Promise<void> {
  const resend = getResend();
  const from = process.env.REPORT_FROM_EMAIL ?? "reports@metroscore.com";

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: reportReadyEmailSubject(params.cityAName, params.cityBName),
    html: reportReadyEmailHtml({
      cityAName: params.cityAName,
      cityBName: params.cityBName,
      reportUrl: params.reportUrl,
    }),
  });

  if (error) {
    throw new Error(`Resend delivery failed: ${error.message}`);
  }
}
