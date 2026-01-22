import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

type DocumentMapping = {
  idNumber: string;
  serialNumber: string;
  fileUrl: string;
  fileName: string;
  createdAt: string;
};

const sanitizeFileName = (name: string) => {
  const safeName = name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9.\-_]/g, "")
    .toLowerCase();
  return safeName || "document.pdf";
};

const createSqlClient = () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not configured.");
  }
  return neon(process.env.POSTGRES_URL);
};

const ensureTable = async () => {
  const sql = createSqlClient();
  await sql`
    CREATE TABLE IF NOT EXISTS document_mappings (
      id_number TEXT NOT NULL,
      serial_number TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_data_base64 TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (id_number, serial_number)
    );
  `;
};

const toDownloadUrl = (idNumber: string, serialNumber: string) =>
  `/api/document-mappings?idNumber=${encodeURIComponent(
    idNumber
  )}&serialNumber=${encodeURIComponent(serialNumber)}&download=1`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idNumber = searchParams.get("idNumber")?.trim();
  const serialNumber = searchParams.get("serialNumber")?.trim();
  const shouldDownload = searchParams.get("download") === "1";

  await ensureTable();
  const sql = createSqlClient();

  if (idNumber && serialNumber) {
    if (shouldDownload) {
      const rows = await sql<
        { file_name: string; file_type: string; file_data_base64: string }[]
      >`
        SELECT file_name, file_type, file_data_base64
        FROM document_mappings
        WHERE id_number = ${idNumber} AND serial_number = ${serialNumber}
        LIMIT 1;
      `;

      const file = rows[0];
      if (!file) {
        return NextResponse.json(
          { message: "No matching document found." },
          { status: 404 }
        );
      }

      const buffer = Buffer.from(file.file_data_base64, "base64");
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": file.file_type,
          "Content-Disposition": `attachment; filename="${sanitizeFileName(
            file.file_name
          )}"`,
          "Content-Length": buffer.length.toString(),
        },
      });
    }

    const rows = await sql<
      { id_number: string; serial_number: string; file_name: string; created_at: string }[]
    >`
      SELECT id_number, serial_number, file_name, created_at
      FROM document_mappings
      WHERE id_number = ${idNumber} AND serial_number = ${serialNumber}
      LIMIT 1;
    `;
    const mapping = rows[0];

    if (!mapping) {
      return NextResponse.json(
        { message: "No matching document found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      idNumber: mapping.id_number,
      serialNumber: mapping.serial_number,
      fileName: mapping.file_name,
      fileUrl: toDownloadUrl(mapping.id_number, mapping.serial_number),
      createdAt: mapping.created_at,
    });
  }

  const rows = await sql<
    { id_number: string; serial_number: string; file_name: string; created_at: string }[]
  >`
    SELECT id_number, serial_number, file_name, created_at
    FROM document_mappings
    ORDER BY created_at DESC;
  `;

  const mappings: DocumentMapping[] = rows.map(
    (row: {
      id_number: string;
      serial_number: string;
      file_name: string;
      created_at: string;
    }) => ({
    idNumber: row.id_number,
    serialNumber: row.serial_number,
    fileName: row.file_name,
    fileUrl: toDownloadUrl(row.id_number, row.serial_number),
    createdAt: row.created_at,
    })
  );

  return NextResponse.json(mappings);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const idNumber = String(formData.get("idNumber") || "").trim();
  const serialNumber = String(formData.get("serialNumber") || "").trim();
  const file = formData.get("file");

  if (!idNumber || !serialNumber) {
    return NextResponse.json(
      { message: "Missing required fields." },
      { status: 400 }
    );
  }

  if (!file || !(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { message: "File upload is required." },
      { status: 400 }
    );
  }

  const extension = (file.name || "").split(".").pop()?.toLowerCase();
  if (extension && extension !== "pdf") {
    return NextResponse.json(
      { message: "Only PDF files are allowed." },
      { status: 400 }
    );
  }

  const safeFileName = sanitizeFileName(file.name || "document.pdf");
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);
  const fileDataBase64 = fileBuffer.toString("base64");

  await ensureTable();
  const sql = createSqlClient();

  const rows = await sql<
    { id_number: string; serial_number: string; file_name: string; created_at: string }[]
  >`
    INSERT INTO document_mappings (
      id_number,
      serial_number,
      file_name,
      file_type,
      file_data_base64
    )
    VALUES (
      ${idNumber},
      ${serialNumber},
      ${safeFileName},
      ${file.type || "application/pdf"},
      ${fileDataBase64}
    )
    ON CONFLICT (id_number, serial_number)
    DO UPDATE SET
      file_name = EXCLUDED.file_name,
      file_type = EXCLUDED.file_type,
      file_data_base64 = EXCLUDED.file_data_base64,
      created_at = NOW()
    RETURNING id_number, serial_number, file_name, created_at;
  `;

  const mapping = rows[0];
  const responsePayload: DocumentMapping = {
    idNumber: mapping.id_number,
    serialNumber: mapping.serial_number,
    fileName: mapping.file_name,
    fileUrl: toDownloadUrl(mapping.id_number, mapping.serial_number),
    createdAt: mapping.created_at,
  };

  return NextResponse.json(responsePayload, { status: 201 });
}
