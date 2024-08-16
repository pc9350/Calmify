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
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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