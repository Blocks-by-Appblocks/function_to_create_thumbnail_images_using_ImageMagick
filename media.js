import path from 'path'
import gm from 'gm'
import fs from 'fs'
import http from 'http'
import https from 'https'


const ABSPATH = path.dirname(import.meta.url).split('file://')[1];

const exists = (path) => {
    try {
        return fs.statSync(path).isFile();
    } catch (e) {
        return false;
    }
};

/**
 * 
 * @param {String} src 
 * @returns String
 */
const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * 
 * @param {String} src 
 * @returns String
 */
const getFileName = (src) => {
    const splitFileName = src.split('/');
    return splitFileName[splitFileName.length - 1]
}

class Media {
    constructor(path) {
        this.src = path;
    }

    /**
     * 
     * @param {String} src 
     * @returns Boolean
     */
    isValidMedia(src) {
        return /\.(jpe?g|png)$/.test(src);
    }

    /**
     * 
     * @param {String} src 
     * @returns Boolean
     */
    isValidBaseDir(src) {
        return /^\/public\/images/.test(src);
        
    }
    
    async imageUrlToBuffer() {
        let client = http;
        if (this.src.toString().indexOf("https") === 0){
          client = https;
        }

        return new Promise((resolve, reject) => {
            const data = [];
            client.get(this.src, function(response) {                                        
                response.on('data', function(chunk) {                                       
                   data.push(chunk);                                                         
                });                                                                         
            
                response.on('end', function() {  
                    resolve(Buffer.concat(data));
                });    
                
                response.on('error', function(err) {
                    reject(err)
                })
             }).end();
        })
    };

    /**
     * 
     * @param {Request} request 
     * @param {Uint8Array[]} buf 
     * @returns String
     */
    thumb(request, buf) {

        const width = (request.query.w && /^\d+$/.test(request.query.w)) ? request.query.w : '150';
        const height = (request.query.h && /^\d+$/.test(request.query.h)) ? request.query.h : '150';

        const fileName = getFileName(this.src)
        const extension = getFileExtension(fileName);

        const FILE_PATH = `${ABSPATH}/public/${fileName}_${width}x${height}.${extension}`

        if(exists(FILE_PATH)) {
            throw new Error('Image already exists')
        }

        return new Promise((resolve, reject) => {
            gm(buf)
            .resize(width, height)
                .write(FILE_PATH, function(data, err) {

                if(err) {
                    reject(err)
                } else {
                    console.log('here written')
                    resolve(FILE_PATH)
                }
            });
        });
    }
}
export default Media;