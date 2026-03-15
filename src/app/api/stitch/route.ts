import { NextRequest, NextResponse } from "next/server";
import { StitchEngine } from "@/lib/stitch";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, city, photos } = body;

    if (!text || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transformedText = StitchEngine.transformDescription(text, city);
    const tags = StitchEngine.generateTags(city);
    const photoAnalysis = photos ? StitchEngine.analyzePhotoQuality(photos) : null;
    const pitch = StitchEngine.getConversionPitch(true);

    return NextResponse.json({
      transformedText,
      tags,
      photoAnalysis,
      pitch,
      success: true
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process Stitch request" }, { status: 500 });
  }
}
