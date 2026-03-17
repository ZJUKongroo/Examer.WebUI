import type { AddUserDetailDto, UserDetailDto } from "~/types";

export function cloneUserDetailToEditForm(detail?: UserDetailDto | null): AddUserDetailDto {
  return {
    gender: detail?.gender ?? 1,
    ethnicGroup: detail?.ethnicGroup ?? 1,
    dateOfBirth: detail?.dateOfBirth ?? "",
    phoneNumber: detail?.phoneNumber ?? "",
    college: detail?.college ?? "",
    major: detail?.major ?? "",
    class: detail?.class ?? "",
    seniorHigh: detail?.seniorHigh ?? "",
    dormitory: detail?.dormitory ?? "",
    politicalStatus: detail?.politicalStatus ?? 1,
    homeAddress: detail?.homeAddress ?? "",
    englishLevel: detail?.englishLevel ?? "",
    gpaOfAllCourses: detail?.gpaOfAllCourses ?? 0,
    gpaOfMajorCourses: detail?.gpaOfMajorCourses ?? 0,
    rank: detail?.rank ?? 1,
    collegeNumber: detail?.collegeNumber ?? 1,
  };
}

export function buildUserDetailPayload(form: AddUserDetailDto): AddUserDetailDto {
  return {
    gender: Number(form.gender),
    ethnicGroup: Number(form.ethnicGroup),
    dateOfBirth: form.dateOfBirth,
    phoneNumber: form.phoneNumber.trim(),
    college: form.college.trim(),
    major: form.major.trim(),
    class: form.class.trim(),
    seniorHigh: form.seniorHigh.trim(),
    dormitory: form.dormitory.trim(),
    politicalStatus: 1,
    homeAddress: form.homeAddress.trim(),
    englishLevel: form.englishLevel.trim(),
    gpaOfAllCourses: Number(form.gpaOfAllCourses),
    gpaOfMajorCourses: 0,
    rank: Number(form.rank),
    collegeNumber: Number(form.collegeNumber),
  };
}
