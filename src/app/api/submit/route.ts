import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import dbConnect from '../../../lib/mongodb';
import { PromptSubmission } from '../../../lib/models';

const resend = new Resend(process.env.RESEND_API_KEY);
const RECIPIENT_EMAIL = 'amargupta2138@gmail.com';
const ADMIN_URL = 'https://claude-prompt-vault-six.vercel.app/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, promptText, name, email } = body;

    // Validate
    if (!title || !category || !promptText || !email) {
      return NextResponse.json(
        { error: 'Title, category, prompt text, and email are required.' },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Save to MongoDB
    await dbConnect();
    const submission = await PromptSubmission.create({
      title,
      category,
      promptText,
      submitterName: name || 'Anonymous',
      submitterEmail: email,
      status: 'pending',
    });

    const submitterDisplay = name ? `${name} (${email})` : email;
    const categoryLabel = category.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    const receivedAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Send a simple notification email — no prompt content, just the alert
    const { error: emailError } = await resend.emails.send({
      from: 'Claude Prompt Vault <onboarding@resend.dev>',
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: `🔮 New prompt submission from ${submitterDisplay}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#F5EDE0;font-family:system-ui,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#FDFAF6;border-radius:16px;overflow:hidden;border:1px solid rgba(180,130,90,0.20);box-shadow:0 4px 20px rgba(80,40,10,0.08);">

    <!-- Orange header bar -->
    <div style="background:linear-gradient(135deg,#CC785C,#B8613D);padding:28px 32px 24px;">
      <div style="font-size:13px;color:rgba(255,255,255,0.75);font-weight:500;margin-bottom:6px;letter-spacing:0.3px;">
        🔮 Claude Prompt Vault
      </div>
      <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff;line-height:1.3;">
        New prompt submission
      </h1>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">
      <p style="margin:0 0 24px;font-size:15px;color:#3D2B1A;line-height:1.6;">
        <strong>${submitterDisplay}</strong> just submitted a new prompt titled
        <strong>&ldquo;${title}&rdquo;</strong> under the <strong>${categoryLabel}</strong> category.
      </p>

      <!-- Details row -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;border-radius:10px;overflow:hidden;border:1px solid rgba(180,130,90,0.20);">
        <tr>
          <td style="padding:10px 14px;background:#F9F3EA;border-bottom:1px solid rgba(180,130,90,0.15);width:38%;">
            <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:#9C8070;">From</span>
          </td>
          <td style="padding:10px 14px;background:#FDFAF6;border-bottom:1px solid rgba(180,130,90,0.15);">
            <span style="font-size:13px;color:#1A1208;">${submitterDisplay}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 14px;background:#F9F3EA;border-bottom:1px solid rgba(180,130,90,0.15);">
            <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:#9C8070;">Category</span>
          </td>
          <td style="padding:10px 14px;background:#FDFAF6;border-bottom:1px solid rgba(180,130,90,0.15);">
            <span style="font-size:13px;color:#1A1208;">${categoryLabel}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 14px;background:#F9F3EA;">
            <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:#9C8070;">Received</span>
          </td>
          <td style="padding:10px 14px;background:#FDFAF6;">
            <span style="font-size:13px;color:#1A1208;">${receivedAt} IST</span>
          </td>
        </tr>
      </table>

      <!-- CTA button -->
      <a href="${ADMIN_URL}"
         style="display:block;text-align:center;background:linear-gradient(135deg,#CC785C,#B8613D);color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:-0.2px;box-shadow:0 3px 12px rgba(204,120,92,0.35);">
        Review in Admin Panel →
      </a>

      <p style="margin:20px 0 0;font-size:12px;color:#9C8070;text-align:center;line-height:1.6;">
        The full prompt is waiting in your admin panel under the <strong>Submissions</strong> tab.<br/>
        You can approve or reject it from there.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;background:#F9F3EA;border-top:1px solid rgba(180,130,90,0.15);">
      <p style="margin:0;font-size:11px;color:#9C8070;text-align:center;">
        Claude Prompt Vault &middot;
        <a href="${ADMIN_URL}" style="color:#CC785C;text-decoration:none;">Admin Panel</a>
        &middot; Submission ID: ${submission._id}
      </p>
    </div>

  </div>
</body>
</html>
      `,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Prompt submitted successfully!',
      submissionId: submission._id,
    });

  } catch (err) {
    console.error('Submit route error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
