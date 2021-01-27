import {FileModel} from "@weare/athenaeum-toolkit";

export default class ImageProvider {
    public static getImageStyle(image: FileModel): any {
        const url: string = (image.src)
            ? image.src
            : `/files/images/${image.id}`;
        return { background: `url(${url})` };
    }
}