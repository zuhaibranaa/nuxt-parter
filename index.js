/**
 * NuxtParter is a utility class for handling HTTP events in a Nuxt.js application.
 * It can parse both multipart form data and regular body data from HTTP requests.
 * It also provides a static method for storing files.
 */
import { readBody, readMultipartFormData } from "h3";
import fs from "fs";
export class NuxtParter {
    /**
     * Store a file to a specified path.
     * @param file - The file to be stored.
     * @param path - The path where the file will be stored.
     */
    static storeFile(file, path) {
        fs.writeFileSync(path, file.data);
    }

    /**
     * Read multipart form data from the HTTP event.
     * The parsed data and files are stored in the instance's `data` and `files` properties respectively.
     */
    static async readRequestData(event) {
        if(event.method === 'GET') return;
        let multipart = await readMultipartFormData(event);
        const tmp_files = [];
        let data = {};
        if (multipart) {
            for(const [index, value] of multipart.entries()){
                if(value.type){
                    tmp_files.push({[value.name]:{
                        filename : value.filename,
                        type: value.type,
                        data: value.data
                    }});
                }else{
                    data[value.name] = value.data.toString();
                }
            }
        }else{
            data = await readBody(event);
        }
        const files = {};
        // Extract files from files array and put them in tmp_files but files may contain multiple files with same name
        for(const file of tmp_files){
            for(const [key, value] of Object.entries(file)){
                if(files[key]){
                    files[key].push(value);
                }else{
                    files[key] = [value];
                }
            }
        }
        return {files, data}
    }
}