/**
 * Generates a random string of specified length
 * @param length Length of random string to generate (default: 8)
 * @returns Random string of specified length
 */
export function randomString(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


// Default export for convenience
export default {
    randomString
}; 