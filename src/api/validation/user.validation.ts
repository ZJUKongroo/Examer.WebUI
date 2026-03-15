import type { AddUserDetailDto } from "~/types";
import { assertFiniteNumber, assertNonEmptyString } from "~/api/validation/common";

export function validateUserId(userId: string): string {
  return assertNonEmptyString(userId, "用户ID");
}

export function validateUserDetailPayload(payload: AddUserDetailDto): AddUserDetailDto {
  return {
    gender: assertFiniteNumber(Number(payload.gender), "性别"),
    ethnicGroup: assertFiniteNumber(Number(payload.ethnicGroup), "民族"),
    dateOfBirth: assertNonEmptyString(payload.dateOfBirth, "出生日期"),
    phoneNumber: assertNonEmptyString(payload.phoneNumber, "手机号"),
    college: assertNonEmptyString(payload.college, "学院"),
    major: assertNonEmptyString(payload.major, "专业"),
    class: assertNonEmptyString(payload.class, "班级"),
    seniorHigh: assertNonEmptyString(payload.seniorHigh, "高中"),
    dormitory: assertNonEmptyString(payload.dormitory, "宿舍"),
    politicalStatus: assertFiniteNumber(Number(payload.politicalStatus), "政治面貌"),
    homeAddress: assertNonEmptyString(payload.homeAddress, "大类"),
    englishLevel: assertNonEmptyString(payload.englishLevel, "英语等级"),
    gpaOfAllCourses: assertFiniteNumber(Number(payload.gpaOfAllCourses), "总课程均绩"),
    gpaOfMajorCourses: assertFiniteNumber(Number(payload.gpaOfMajorCourses), "专业课程绩点"),
    rank: assertFiniteNumber(Number(payload.rank), "排名"),
    collegeNumber: assertFiniteNumber(Number(payload.collegeNumber), "专业总人数"),
  };
}
