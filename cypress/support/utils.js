const letters = 'abcdefghijklmnopqrstuvwxyz';

class Utils {
    generateRandomInt(range) {
        return Math.floor(Math.random() * range);
    }
      
    generateRandomString(length) {
        let result = '';
      
        for (let i = 0; i < length; i++) {
          result += letters.charAt(this.generateRandomInt(letters.length));
        }
      
        return result;
    }
}

export const utils = new Utils();
