import { hash, compare } from "bcryptjs";

class HashingSecurityUtil {
  static hashText = ({
    plainText,
    salt = Number(process.env.HASH_SALT),
  }: {
    plainText: string;
    salt?: number;
  }): Promise<string> => {
    return hash(plainText, salt);
  };

  static compareHash = ({
    plainText,
    cipherText,
  }: {
    plainText: string;
    cipherText: string;
  }): Promise<boolean> => {
    return compare(plainText, cipherText);
  };

  static isHashed = ({ text }: { text: string }) => {
    return (
      typeof text === "string" &&
      text.length === 60 &&
      (text.startsWith("$2a$") ||
        text.startsWith("$2b$") ||
        text.startsWith("$2y$"))
    );
  };
}

export default HashingSecurityUtil;
