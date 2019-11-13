const fileError = (code, path) => {
    switch(code) {
        case 'ENOENT':
            return `File ${path} doesn't exist`;
        default:
            return `Error handling file ${path}`;
    }
};

module.exports = {
    fileError
};