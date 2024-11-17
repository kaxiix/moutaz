// File: app/api/uploadImage/route.ts

import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";

const drive = google.drive("v3");
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});
google.options({ auth });

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    // Convert base64 image string to a buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Create a stream from the buffer
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);

    const folderId = process.env.GOOGLE_FOLDER_ID; // Ensure this is set in your .env file
    if (!folderId) {
      return NextResponse.json({ error: "Google Drive folder ID is not configured" }, { status: 500 });
    }

    // Set metadata for the uploaded file
    const fileMetadata = {
      name: `uploaded-image-${Date.now()}.png`,
      parents: [folderId],
    };

    const media = {
      mimeType: "image/png",
      body: bufferStream,
    };

    // Attempt to upload the file to Google Drive
    const fileResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink, webContentLink",
    });

    if (fileResponse.status !== 200 || !fileResponse.data.webContentLink) {
      return NextResponse.json({ error: "Failed to upload image to Google Drive" }, { status: 500 });
    }

    // Return the link to the uploaded image
    const fileUrl = fileResponse.data.webContentLink;
    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error("Failed to upload image:", error);
    return NextResponse.json({ error: "Failed to upload image to Google Drive" }, { status: 500 });
  }
}
