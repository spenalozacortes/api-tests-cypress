class NumberUtils {
    generateRandomInt(range) {
        return Math.floor(Math.random() * range);
    }
}

export const numberUtils = new NumberUtils();
