import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subject, content } = body;

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subjek dan isi pesan harus diisi' }, { status: 400 });
    }

    // Mengambil data email unik pelanggan dari riwayat pesanan (Order) yang Selesai
    const pesanan = await prisma.order.findMany({
      where: {
        statusPesanan: 'SELESAI',
        emailPenerima: {
          contains: '@'
        }
      },
      select: { emailPenerima: true },
      distinct: ['emailPenerima']
    });

    const validEmails = pesanan
      .map(p => p.emailPenerima)
      .filter(email => email && email.includes('@'));

    if (validEmails.length === 0) {
      return NextResponse.json({ error: 'Tidak ada data email pelanggan yang valid di database' }, { status: 400 });
    }

    // Resend Batch API memiliki batas pengiriman sekaligus (hingga 100 email per request)
    const chunkSize = 100;
    const results = [];

    for (let i = 0; i < validEmails.length; i += chunkSize) {
      const chunk = validEmails.slice(i, i + chunkSize);
      
      // Membentuk array of objects untuk format Resend Batch API
      const batchPayload = chunk.map(email => ({
        from: 'onboarding@resend.dev',
        to: email,
        subject: subject,
        html: content.replace(/\n/g, '<br/>')
      }));

      const { data, error } = await resend.batch.send(batchPayload);

      if (error) {
        console.error('Resend Batch Error:', error);
        return NextResponse.json({ error: error.message || 'Gagal mengirim email broadcast' }, { status: 400 });
      }

      results.push(data);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Broadcast berhasil diproses untuk ${validEmails.length} email pelanggan.`,
      data: results 
    });

  } catch (error: any) {
    console.error('Broadcast API Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server: ' + (error.message || 'Unknown Error') }, { status: 500 });
  }
}
