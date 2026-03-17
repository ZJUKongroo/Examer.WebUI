<template>
    <v-form>
        <v-select v-model="form.gender" :items="genderOptions" label="性别" density="comfortable" item-title="title"
            item-value="value" :required="required" />
        <v-select v-model="form.ethnicGroup" :items="ethnicGroupOptions" label="民族" density="comfortable"
            item-title="title" item-value="value" :required="required" />
        <v-text-field v-model="form.dateOfBirth" type="date" label="出生日期" density="comfortable" placeholder="请选择出生日期"
            :required="required" />
        <v-text-field v-model="form.college" label="学院（园）" density="comfortable" placeholder="例如：计算机科学与技术学院"
            :required="required" />
        <v-text-field v-model="form.homeAddress" label="大类" density="comfortable" placeholder="例如：云峰学园"
            :required="required" />
        <v-text-field v-model="form.major" label="专业" density="comfortable" placeholder="例如：软件工程"
            :required="required" />
        <v-text-field v-model="form.class" label="班级" density="comfortable" placeholder="例如：软工2301"
            :required="required" />
        <v-text-field v-model="form.phoneNumber" label="手机号" density="comfortable" placeholder="例如：13800138000"
            :required="required" />
        <v-text-field v-model="form.seniorHigh" label="高中" density="comfortable" placeholder="例如：杭州市高级中学"
            :required="required" />
        <v-text-field v-model="form.dormitory" label="宿舍" density="comfortable" placeholder="例如：丹阳3舍301"
            :required="required" />
        <v-text-field v-model="form.englishLevel" label="英语等级（填写考试名称和分数）" density="comfortable"
            placeholder="请填写雅思/托福/英语四级/英语六级成绩" :required="required" />
        <v-text-field v-model.number="form.gpaOfAllCourses" type="number" step="0.01" min="0" label="总课程均绩"
            density="comfortable" placeholder="填写总课程均绩，例如 3.75" :required="required" />
        <v-text-field v-model.number="form.rank" type="number" label="专业（大类）综合排名" density="comfortable"
            :required="required" />
        <v-text-field v-model.number="form.collegeNumber" type="number" label="本专业（大类）人数" density="comfortable"
            :required="required" @keyup.enter="handleSubmitOnEnter" />
    </v-form>
</template>

<script setup lang="ts">
import type { AddUserDetailDto } from "~/types";
import { EthnicGroup } from "~/enums";

const props = withDefaults(
    defineProps<{
        form: AddUserDetailDto;
        required?: boolean;
        submitOnEnter?: boolean;
    }>(),
    {
        required: false,
        submitOnEnter: false,
    }
);

const emit = defineEmits<{
    (e: "submit"): void;
}>();

const genderOptions = [
    { title: "男", value: 1 },
    { title: "女", value: 2 },
];

const ethnicGroupOptions = Object.keys(EthnicGroup)
    .filter((key) => Number.isNaN(Number(key)) && key !== "Null")
    .map((key) => ({
        title: key,
        value: EthnicGroup[key as keyof typeof EthnicGroup] as number,
    }));

// function politicalStatusName(code?: number): string {
//   if (!code) return "—";
//   return PoliticalStatus[code] ?? "—";
// }

function handleSubmitOnEnter(): void {
    if (props.submitOnEnter) {
        emit("submit");
    }
}
</script>
