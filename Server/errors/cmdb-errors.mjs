export const errors = {
    INVALID_TEXT: invalidText,
    NOT_FOUND: notFound,
    NOT_AUTHORIZE: notAuthorize,
    ALREADY_EXISTS: alreadyExists
}


function invalidText(text) {
    return {
        code: "e1",
        error: `Enter a valid ${text}!!`
    }
}

function notFound(obj) {
    return {
        code: "e2",
        error: `${obj} not Found!!`
    }
}

function notAuthorize(msg) {
    return {
        code: "e3",
        error: msg
    }
}

function alreadyExists(obj) {
    return {
        code: "e4",
        error: `${obj} already Exists!!`
    }
}