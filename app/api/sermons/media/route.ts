import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { v4 as uuidv4 } from "uuid"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Configure S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Validate file types based on content type
const validateContentType = (contentType: string, folder: string): boolean => {
  const allowedTypes: Record<string, string[]> = {
    'sermon-audio': ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a'],
    'sermon-videos': ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
    'sermon-thumbnails': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  }

  return allowedTypes[folder]?.includes(contentType) || false
}

export async function POST(req: Request) {
  try {
    // Authenticate user
    const token = await getToken({ req })
    
    if (!token?.id || !["SUPERADMIN", "PASTOR", "ADMIN"].includes(token.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { filename, contentType, folder = "general" } = body

    // Validate required fields
    if (!filename || !contentType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate content type
    if (!validateContentType(contentType, folder)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Generate a unique file name
    const fileExtension = filename.split('.').pop()
    const uniqueFilename = `${folder}/${uuidv4()}.${fileExtension}`

    // Create an upload command
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: uniqueFilename,
      ContentType: contentType,
    })

    // Generate a pre-signed URL for direct upload
    const uploadUrl = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 3600 })
    
    // Generate the final file URL that will be stored in the database
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`

    return NextResponse.json({ uploadUrl, fileUrl }, { status: 200 })
  } catch (error) {
    console.error("Error generating upload URL:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
