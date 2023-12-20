import { readBody, readMultipartFormData } from "h3";

export default async (event) => {
    if(event.method !== 'GET'){
        if(event.headers.get('content-type').includes('multipart/form-data')){
            let multipart = await readMultipartFormData(event);
            const files = {};
            const data = {};
            for(const [key, value] of multipart.entries()){
                if(value.type){
                    files[value.name] = {
                        filename : value.filename,
                        type: value.type,
                        data: value.data
                    };
                }else{
                    data[value.name] = value.data.toString();
                }
            }
            event.context.files = files;
            event.context.body = data;
        }else{
            let body = await readBody(event);
            event.context.body = body;
        }
    }
}