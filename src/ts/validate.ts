export function validatePassword(_: any, password: string, callback: any) {
    password = password.trim();
    if (!password) {
        callback(new Error("请输入密码..."))
    }
    else {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        if (hasUpperCase && hasLowerCase && hasSpecialChar && hasNumber) {
            callback()
        }
        else callback(new Error("密码必须包括大写字母、小写字母、数字和特殊字符"))
    }
}

function calculateChecksum(identityNo: string) {
    const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    let sum = 0;
    for (let i = 0; i < 17; i++) {
        sum += Number(identityNo[i]) * factors[i];
    }
    const mod = sum % 11;
    return checkCodes[mod];
}

type Identity = "ml" | "hm" | "p";

export function validateIdentityNo(rule: any, identityNo: string, callback: any) {
    identityNo = identityNo.trim();
    if (rule.identity) {
        const identity: Identity = rule.identity;
        switch (identity) {
            case "ml":
                if (!identityNo) {
                    callback(new Error("请输入身份证号..."));
                }
                else {
                    const rightLength = identityNo.length == 18;
                    if (!rightLength) {
                        callback(new Error("身份证号长度错误"))
                        return;
                    }
                    const composeWithNumeber = /^\d+$/.test(identityNo.slice(0, 17));
                    if (!composeWithNumeber) {
                        callback(new Error("身份证号前十七位只能由数字组成"))
                        return;
                    }
                    const rightChecksum = calculateChecksum(identityNo) === identityNo[17];
                    if (!rightChecksum) {
                        callback(new Error("身份证号校验码错误"))
                        return;
                    }
                    const rightDate = Number(identityNo.slice(6, 10)) <= (new Date()).getFullYear() && Number(identityNo.slice(10, 12)) <= 12 && Number(identityNo.slice(12, 14)) <= 31;
                    if (!rightDate) {
                        callback(new Error("出生日期错误"))
                        return;
                    }
                    callback()
                }
                break;
            case "hm":
                if (!identityNo) {
                    callback(new Error("请输入港澳通行证..."));
                }
                else {
                    const pattern = /^[HM][0-9]{8}$/;
                    if (pattern.test(identityNo)) {
                        callback();
                    }
                    else callback(new Error("港澳通行证格式错误"));
                }
                break;
            case "p":
                if (!identityNo) {
                    callback(new Error("请输入护照..."));
                }
                else callback();
                break;
            default:
                callback(new Error("无法识别证件类型"));
        }
    }
}

export function validatePhoneNumber(_: any, phoneNumber: string, callback: any) {
    phoneNumber = phoneNumber.trim();
    if (!phoneNumber) {
        callback(new Error("请输入电话号码..."))
    }
    else {
        const rightLength = phoneNumber.length == 11;
        if (!rightLength) {
            callback(new Error("电话号码长度错误"))
            return;
        }
        const composeWithNumeber = /^\d+$/.test(phoneNumber);
        if (!composeWithNumeber) {
            callback(new Error("电话号码只能由数字组成"))
            return;
        }
        callback()
    }
}

export function validateStudentNo(_: any, studentNo: string, callback: any) {
    studentNo = studentNo.trim();
    if (!studentNo) {
        callback(new Error("请输入学号..."))
    }
    else {
        const rightLength = studentNo.length == 10;
        if (!rightLength) {
            callback(new Error("学号长度错误"))
            return;
        }
        const composeWithNumeber = /^\d+$/.test(studentNo);
        if (!composeWithNumeber) {
            callback(new Error("学号只能由数字组成"))
            return;
        }
        callback()
    }
}