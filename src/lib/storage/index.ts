import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"

/**
 * Storage abstraction. Local-disk driver for dev; implement `putObject` with
 * S3/R2/UploadThing for multi-instance production deployments.
 */
export interface StorageDriver {
  putObject(key: string, data: Buffer, contentType: string): Promise<void>
  getObject(key: string): Promise<Buffer>
}

class LocalDiskDriver implements StorageDriver {
  private baseDir: string

  constructor(baseDir?: string) {
    this.baseDir = baseDir || process.env.UPLOAD_DIR || ".data/uploads"
  }

  private resolve(key: string): string {
    // Prevent path traversal.
    const safeKey = key.replace(/\.\./g, "").replace(/^\/+/, "")
    return join(this.baseDir, safeKey)
  }

  async putObject(
    key: string,
    data: Buffer,
    _contentType: string,
  ): Promise<void> {
    const path = this.resolve(key)
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, data)
  }

  async getObject(key: string): Promise<Buffer> {
    const { readFile } = await import("node:fs/promises")
    return readFile(this.resolve(key))
  }
}

export const storage: StorageDriver = new LocalDiskDriver()
