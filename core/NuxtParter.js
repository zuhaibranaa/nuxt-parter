/**
 * NuxtParter is a utility class for handling HTTP events in a Nuxt.js application.
 * It can parse both multipart form data and regular body data from HTTP requests.
 * It also provides a static method for storing files.
 */
import { readBody, readMultipartFormData } from "h3";
import fs from "fs";
export class NuxtParter {
    _e = null;
    files= {};
    data= {};

    /**
     * Store a file to a specified path.
     * @param file - The file to be stored.
     * @param path - The path where the file will be stored.
     */
    static storeFile(file, path) {
        fs.writeFileSync(path, file.data);
    }

    /**
     * Create a new NuxtParter instance.
     * @param event - The HTTP event to be handled.
     */
    constructor(e) {
        this._e = e;
        if(e.method !== 'GET'){
            if(e.headers.get('content-type')?.includes('multipart/form-data')){
                this._readFormData();
            }else{
                this._readBody()
            }
        }
    }

    /**
     * Read multipart form data from the HTTP event.
     * The parsed data and files are stored in the instance's `data` and `files` properties respectively.
     */
    async _readFormData() {
        let multipart = await readMultipartFormData(this._e);
        if (multipart) {
            const files = {};
            const data = {};

            for(const [index, value] of multipart.entries()){
                if(value.type){
                    this.files[value.name] = {
                        filename : value.filename,
                        type: value.type,
                        data: value.data
                    };
                }else{
                    this.data[value.name] = value.data.toString();
                }
            }

            this._e.context.files = files;
            this._e.context.body = data;
        }
    }

    /**
     * Read the body data from the HTTP event.
     * The parsed data is stored in the instance's `data` property.
     */
    async _readBody() {
        let body = await readBody(this._e);
        this.data = body;
        this._e.context.body = body;
    }
}