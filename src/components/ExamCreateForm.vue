<template>
    <div id="exam-create-dialog-container">
        <h1 class="mb-4">新建考试</h1>
        <v-form @submit.prevent="submitForm">
            <v-text-field v-model="form.name" label="考试名称" required></v-text-field>
            <v-switch v-model="form.examType" :true-value="ExamType.GroupExam" :false-value="ExamType.UserExam">
                <template #label>
                    <span>小组赛</span>
                </template>
                <template #prepend>
                    <span>个人赛</span>
                </template>
            </v-switch>
            <v-switch v-model="form.isPublic" :true-value="true" :false-value="false">
                <template #label>
                    <span>公开赛</span>
                </template>
                <template #prepend>
                    <span>内部赛</span>
                </template>
            </v-switch>
            <div class="exam-create-time-picker">
                <v-menu v-model="menuVisible.startDate" :close-on-content-click="false" transition="scale-transition"
                    offset-y min-width="290px">
                    <template #activator="{ props }">
                        <v-text-field :model-value="form.startDate.toDateString()" label="开始日期" readonly v-bind="props"
                            append-inner-icon="mdi-calendar" hint="选择开始日期"></v-text-field>
                    </template>
                    <v-date-picker v-model="form.startDate" @input="menuVisible.startDate = false" no-title
                        scrollable></v-date-picker>
                </v-menu>
                <v-menu v-model="menuVisible.startTime" :close-on-content-click="false" transition="scale-transition"
                    offset-y min-width="290px">
                    <template #activator="{ props }">
                        <v-text-field v-model="form.startTime" label="开始时间" readonly v-bind="props"
                            append-inner-icon="mdi-calendar-clock" hint="选择开始时间"></v-text-field>
                    </template>
                    <v-time-picker v-model="form.startTime" format="24hr" scrollable></v-time-picker>
                </v-menu>
            </div>
            <div class="exam-create-time-picker">
                <v-menu v-model="menuVisible.endDate" :close-on-content-click="false" transition="scale-transition" offset-y
                    min-width="290px">
                    <template #activator="{ props }">
                        <v-text-field :model-value="form.endDate.toDateString()" label="结束日期" readonly v-bind="props"
                            append-inner-icon="mdi-calendar" hint="选择结束日期"></v-text-field>
                    </template>
                    <v-date-picker v-model="form.endDate" @input="menuVisible.endDate = false" no-title scrollable></v-date-picker>
                </v-menu>
                <v-menu v-model="menuVisible.endTime" :close-on-content-click="false" transition="scale-transition"
                    offset-y min-width="290px">
                    <template #activator="{ props }">
                        <v-text-field v-model="form.endTime" label="结束时间" readonly v-bind="props"
                            append-inner-icon="mdi-calendar-clock" hint="选择结束时间"></v-text-field>
                    </template>
                    <v-time-picker v-model="form.endTime" format="24hr" scrollable></v-time-picker>
                </v-menu>
            </div>
            <v-btn variants="tonal" type="submit">提交</v-btn>
        </v-form>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ExamType } from '~/enums';
import { useMainStore } from '~/store/mainStore';
import { createExam } from '~/api';
import { handleApiError } from '~/api/error';

const menuVisible = ref({
    startDate: false,
    startTime: false,
    endDate: false,
    endTime: false,
});
const store = useMainStore();
const router = useRouter();
const form = ref({
    name: "",
    startTime: "00:00",
    startDate: new Date(),
    endTime: "00:00",
    endDate: new Date(),
    examType: ExamType.UserExam,
    isPublic: true,
});

function mergeDateAndTime(date: Date, timeString: string): string {
    const result = new Date(date);
    const [hours, minutes] = timeString.split(':').map(Number);
    
    result.setHours(hours);
    result.setMinutes(minutes);
    result.setSeconds(0);
    result.setMilliseconds(0);
    
    return result.toISOString();
}

const submitForm = async () => {
    const newExam = {
        name: form.value.name,
        examType: form.value.examType,
        startTime: mergeDateAndTime(form.value.startDate, form.value.startTime),
        endTime: mergeDateAndTime(form.value.endDate, form.value.endTime),
        isPublic: form.value.isPublic,
    };
    try {
        const response = await createExam(newExam);
        const data = response.data;
        store.refreshExamData();
        ElMessage.success("已新建考试");
        if (form.value.examType === ExamType.GroupExam) {
            openPath("/exam/group", { id: data.id });
        }
        else openPath("/exam/candidate", { id: data.id });
    } catch (error) {
        handleApiError(error, { fallbackMessage: "新建考试失败" });
    }
};

function openPath(path: string, query?: any) {
    router.push({
        path,
        query,
    });
}
</script>

<style>
.exam-create-time-picker {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-bottom: 20px;
}

#exam-create-dialog-container {
    padding: 20px;
    box-sizing: border-box;
}
</style>