class ApiError{
    constructor(statusCode,message='Something went wrong',errors =[]){
        this.statusCode = statusCode
        this.message = message
        this.data = null
        this.errors = errors
    }
}

export {ApiError}