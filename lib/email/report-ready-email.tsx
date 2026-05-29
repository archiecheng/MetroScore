interface ReportReadyEmailProps {
  cityAName: string;
  cityBName: string;
  reportUrl: string;
}

export function reportReadyEmailHtml(props: ReportReadyEmailProps): string {
  const { cityAName, cityBName, reportUrl } = props;
  const title = `${cityAName} vs ${cityBName}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your MetroScore Report Is Ready</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;">
              <span style="font-size:20px;font-weight:700;color:#2563eb;letter-spacing:-0.5px;">MetroScore</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;padding:36px 32px;">

              <p style="margin:0 0 8px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;">
                Your Report Is Ready
              </p>
              <h1 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#0f172a;line-height:1.3;">
                ${title}
              </h1>

              <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.6;">
                Thank you for your purchase. Your full city comparison report is ready —
                including scores, charts, risk alerts, and a clear recommendation.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#2563eb;border-radius:8px;">
                    <a href="${reportUrl}"
                       style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                      View Your Report →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 4px;font-size:13px;color:#94a3b8;">
                Or copy this link into your browser:
              </p>
              <p style="margin:0 0 28px;font-size:12px;color:#64748b;word-break:break-all;">
                ${reportUrl}
              </p>

              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px;" />

              <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
                <strong>Disclaimer:</strong> MetroScore provides data-based educational analysis and
                does not provide financial, legal, tax, or real estate investment advice. Consult
                qualified professionals before making purchase or investment decisions.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:20px;text-align:center;font-size:12px;color:#94a3b8;">
              © ${new Date().getFullYear()} MetroScore. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function reportReadyEmailSubject(cityAName: string, cityBName: string): string {
  return `Your MetroScore City Comparison Report Is Ready — ${cityAName} vs ${cityBName}`;
}
