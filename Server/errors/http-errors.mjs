const ERRORS_MAPPER = {
    e1: 400,
    e2: 404,
    e3: 401,
    e4: 409
}

const DEFAULT_ERROR = {
    status: 500, 
    body: `An internal error occurred. Contact your system administrator`
 }

export function convertToHttpError(error) {
    const status = ERRORS_MAPPER[error.code]
    return status ?  
        {
            status: status, 
            body: error.error
        } 
        : DEFAULT_ERROR
}