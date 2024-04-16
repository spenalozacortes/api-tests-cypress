import { numberUtils } from "./NumberUtils";

const letters = 'abcdefghijklmnopqrstuvwxyz';

class StringUtils {
    generateRandomString(length) {
        let result = '';
      
        for (let i = 0; i < length; i++) {
          result += letters.charAt(numberUtils.generateRandomInt(letters.length));
        }
      
        return result;
    }
}

export const stringUtils = new StringUtils();
