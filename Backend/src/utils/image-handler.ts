import path from "node:path";
import fs from "fs/promises"
import { UploadedFile } from "express-fileupload";

class ImageHandler {

    public readonly folderPath = path.join(__dirname, "..", "assets", "images");


    public async addImage(image: UploadedFile): Promise<string> {

        await fs.mkdir(this.folderPath, { recursive: true });

        const fileType = path.extname(image.name);
        const imageId = crypto.randomUUID() + fileType;

        const filePath = path.join(this.folderPath, imageId);

        await fs.writeFile(filePath, image.data);

        return imageId;

    }

    public async removeImage(imagePath: string): Promise<void> {
        await fs.unlink(imagePath);
    }



}

export const imageHandler = new ImageHandler();