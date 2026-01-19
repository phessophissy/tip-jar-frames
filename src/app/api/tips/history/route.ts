import { NextRequest, NextResponse } from 'next/server';
import { getTipsByRecipient } from '@/indexer/database';

export async function GET(
  request: NextRequest,
  { searchParams }: { searchParams: { recipient: string; limit?: string } }
) {
  try {
    const recipient = searchParams.get('recipient');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!recipient) {
      return NextResponse.json({ error: 'Recipient address required' }, { status: 400 });
    }

    const tips = getTipsByRecipient(recipient, limit);

    return NextResponse.json({ tips });
  } catch (error) {
    console.error('Error fetching tip history:', error);
    return NextResponse.json({ error: 'Failed to fetch tip history' }, { status: 500 });
  }
}
