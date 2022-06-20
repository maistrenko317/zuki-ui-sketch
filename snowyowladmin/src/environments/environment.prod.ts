export const environment = {
    production: true,
    srd: {
        mediaUrl: 'https://snowl-wms-origin--0--nc11-1.shoutgameplay.com',
        socketIOUrl: 'https://snowl-socketio--0--nc11-1.shoutgameplay.com',
        wdsUrl: 'https://snowl-wds-origin--0--nc11-1.shoutgameplay.com',
        collectorUrl: 'https://snowl-collector--0--nc11-1.shoutgameplay.com'
    },
    /* (Rafael Solano 2022-04-21) Temporary Patch */
    domains : {
        documentsUrl: "https://ec2-54-172-158-53.compute-1.amazonaws.com:8443/document",
        playUrl: "https://zuki.resultier.dev/game",
        publicListingUrl: "https://stirring-treacle-448703.netlify.app/",
        zukiURL: "https://3.227.21.80:8443", /* https://localhost:8443 */
    },
    s3: {
        bucketName: 'resultier',
        region: 'us-east-1',
        accessKeyId:'AKIA2GQZCNRIBJGXT7OP',
        secretAccessKey: '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',
        s3Url: 'http://resultier.s3-website-us-east-1.amazonaws.com/'
    }    
    /* */   
};
