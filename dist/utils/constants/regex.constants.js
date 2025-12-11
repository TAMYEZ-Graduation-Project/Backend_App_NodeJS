class AppRegex {
    static nameRegex = /^[A-Z][a-z]{1,24}$/;
    static fullNameRegex = /^[A-Z][a-z]{1,24}\s[A-Z][a-z]{1,24}$/;
    static passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\W).{8,}$/;
    static otpRegex = /^\d{6}$/;
    static tokenRegex = /^.+\..+\..+$/;
    static bearerWithTokenRegex = /^(BUser|BSystem|BSuperSystem)\ .+\..+\..+$/;
    static phoneNumberRegex = /^(\+20)(10|11|12|15)\d{8}$/;
    static getFileWithUrlRegex = /^(users)\/[0-9a-f]{24}\/.+\.(jpeg|jpg|png|gif)/;
    static quizTitleRegex = /^(?=.{3,200}$)[A-Z][a-z]+(\s[A-Z][a-z]+)*$/;
    static fcmTokenRegex = /^[A-Za-z0-9_:\-]{20,4096}$/;
}
export default AppRegex;
