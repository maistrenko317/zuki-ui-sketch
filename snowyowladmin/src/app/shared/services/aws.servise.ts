import * as AWS from "aws-sdk";
import { environment } from "environments/environment";

const s3bucket = new AWS.S3({
    accessKeyId: environment.s3.accessKeyId,
    secretAccessKey: environment.s3.secretAccessKey
});

export interface AWSServiceResult {
    location: string;
}
export class AWSService {
    public static async uploadText(key: string, text:string): Promise<AWSServiceResult> {
        
        const params = {
          Bucket: environment.s3.bucketName,
          Key: key,
          Body: text
        };

        return new Promise((resolve, reject) => {
            s3bucket.upload(params, function(err:Error, data: AWS.S3.ManagedUpload.SendData) {
              
              if (err) {
                return reject(err);
              }
              
              return resolve({location: data.Location});
            });
          });        
    }

    public static async fetchText(key: string): Promise<string>  {
      const params = {
        Bucket: environment.s3.bucketName,
        Key: key
      };      

      return new Promise((resolve, reject) => {
        s3bucket.getObject(params, (err: Error, data: AWS.S3.GetObjectOutput) => {
          if (err) {
            return reject(err);
          }
          
          return resolve(data.Body ? data.Body.toString() : "");          
        })
      });
    }
}