import {
  RekognitionClient,
  DetectFacesCommand,
} from "@aws-sdk/client-rekognition";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { image } = await request.json();

    const base64Image = image.split(",")[1];

    const rekognition = new RekognitionClient({
      region: "us-west-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_API_KEY,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_API_SECRET_KEY,
      },
    });

    const params = {
      Image: {
        Bytes: Buffer.from(base64Image, "base64"),
      },
      Attributes: ["ALL"],
    };

    const command = new DetectFacesCommand(params);
    const data = await rekognition.send(command);

    if (data.FaceDetails && data.FaceDetails.length > 0) {
      const emotions = data.FaceDetails[0].Emotions;
      return NextResponse.json({ emotions });
    } else {
      return NextResponse.json({ error: "No faces detected" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error detecting emotion:", error);
    return NextResponse.json(
      { error: "Error detecting emotion" },
      { status: 500 }
    );
  }
}
