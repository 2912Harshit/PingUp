// import ImageKit from "imagekit";
// import dotenv from "dotenv";
// dotenv.config();


// var imagekit = new ImageKit({
//   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//   urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT,
// });
// export default imagekit;


// SDK initialization

// var ImageKit = require("imagekit");
import ImageKit from "imagekit";

var imagekit = new ImageKit({
    publicKey : "public_8oKIxgD8nnnYruuwNzhwdSUB8ZY=",
    privateKey : "private_ulZtvUYw//Fgwya0oq2nkU3puuI=",
    urlEndpoint : "https://ik.imagekit.io/gftoy6gio"
});

export default imagekit;