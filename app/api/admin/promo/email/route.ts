import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emails, subject, content } = body;

    if (!emails || !emails.length) {
      return NextResponse.json({ error: 'Tidak ada email tujuan' }, { status: 400 });
    }

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subjek dan isi pesan harus diisi' }, { status: 400 });
    }

    // Menggunakan Bcc untuk mengirim ke banyak alamat secara tersembunyi
    // Maksimal penerima untuk Resend per request adalah 50.
    // Jika lebih dari 50, kita bisa memotongnya (chunk)
    const chunkedEmails = [];
    for (let i = 0; i < emails.length; i += 50) {
      chunkedEmails.push(emails.slice(i, i + 50));
    }

    const results = [];
    for (const chunk of chunkedEmails) {
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev', // Default sender email for dev
        to: 'onboarding@resend.dev',   // Primary recipient
        bcc: chunk,
        subject: subject,
        html: content.replace(/\n/g, '<br/>'), // Mengubah newline menjadi <br/>
      });

      if (error) {
        console.error('Resend Error:', error);
        return NextResponse.json({ error: error.message || 'Gagal mengirim email' }, { status: 400 });
      }
      results.push(data);
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    console.error('Email API Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
