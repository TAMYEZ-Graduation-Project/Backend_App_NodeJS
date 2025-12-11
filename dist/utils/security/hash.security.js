import { hash, compare } from "bcryptjs";
class HashingSecurityUtil {
    static hashText = ({ plainText, salt = Number(process.env.HASH_SALT), }) => {
        return hash(plainText, salt);
    };
    static compareHash = ({ plainText, cipherText, }) => {
        return compare(plainText, cipherText);
    };
    static isHashed = ({ text }) => {
        return (typeof text === "string" &&
            text.length === 60 &&
            (text.startsWith("$2a$") ||
                text.startsWith("$2b$") ||
                text.startsWith("$2y$")));
    };
}
export default HashingSecurityUtil;
