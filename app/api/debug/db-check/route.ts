import { NextRequest, NextResponse } from 'next/server';
import { checkFirestoreSchema } from '@/app/utils/checkDbSchema';

export async function GET(request: NextRequest) {
  try {
    const result = await checkFirestoreSchema();
    
    return NextResponse.json({
      message: 'Database schema check completed',
      result
    });
  } catch (error) {
    console.error('Error in db-check API:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred while checking the database' },
      { status: 500 }
    );
  }
}
