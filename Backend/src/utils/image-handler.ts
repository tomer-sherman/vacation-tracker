import path from "node:path";
import fs from "fs/promises"
import { UploadedFile } from "express-fileupload";
import { Client } from "@modelcontextprotocol/sdk/client";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";

class ImageHandler {

    public readonly folderPath = path.join(__dirname, "..", "assets", "images");


    public async addImage(image: UploadedFile): Promise<string> {

        // Creates a file at this specific path, and creates The path to it if non existent
        await fs.mkdir(this.folderPath, { recursive: true });

        // gets the file type creates a uid, and adds the file type to the end.
        const fileType = path.extname(image.name);
        const imageId = crypto.randomUUID() + fileType;

        // File path
        const filePath = path.join(this.folderPath, imageId);

        // Creates the file to this filePath , using this specific image data.
        await fs.writeFile(filePath, image.data);


        return imageId;

    }

    public async removeImage(imagePath: string): Promise<void> {
        try {
            await fs.unlink(imagePath);
        } catch (err: any) {
            throw new ClientError(StatusCode.InternalServerError, `Image was not removed.`)
        }
    }



}

export const imageHandler = new ImageHandler();