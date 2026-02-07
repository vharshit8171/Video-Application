// These class are made so that our response and error should be send in a standard formate.

class ApiResponse{
    constructor(statusCode,data,message = 'Success'){
        this.statusCode = statusCode
        this.data = data
        this.message = message
    }
} 

export {ApiResponse}