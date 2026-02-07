import dbConnection from "./db_connection/index.js";
import {app} from './server.js'
import 'dotenv/config'

// Main entry point of our server is this file.This file simply import the db connection function and our main express app from server.js file so that our code is easily maintainable and debuggable.
//After calling this function our db connection is finished so after that we have to run our server which is taken from server.js file
dbConnection()
.then(() =>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on  http://localhost:${process.env.PORT}`)
      })
})
.catch((error) =>{
    console.log("Mongodb connection is failed!!!",error);
})
