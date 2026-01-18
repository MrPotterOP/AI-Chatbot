export const isValidId = (id) => {
    return id && id.startsWith('User-') && id.length == 14
}