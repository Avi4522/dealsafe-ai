import { NextRequest, NextResponse } from 'next/server';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Forward to Python FastAPI microservice
    const pythonFormData = new FormData();
    pythonFormData.append('file', file);

    const res = await fetch(`${PYTHON_SERVICE_URL}/extract`, {
      method: 'POST',
      body: pythonFormData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Python service error: ${errorText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Extract API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Document extraction failed' },
      { status: 500 }
    );
  }
}