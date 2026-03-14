<template>
    <div id="mask" v-if="visible" @click.self="handleClose">
        <div ref="bg" id="bg">
            <div id="content">
                <div class="delete-confirm-container">
                    <h1 class="mb-4">
                        删除 {{ name }}
                    </h1>
                    <div class="delete-warning-box">
                        <div class="delete-warning-box-title">
                            <v-icon icon="mdi-alert"></v-icon>警告</div>
                        <div v-if="input" class="delete-warning-box-body">尽管也许您仍可联系管理员恢复删除的内容，但是删除仍然是危险行为并且大概率无法恢复，请在下方输入名称以确认删除
                        </div>
                        <div v-if="!input">删除是危险行为，请点击确认以执行</div>
                    </div>
                    <v-text-field v-if="input" style="margin-bottom: 20px;" v-model="confirm_delete_name" label="输入名称" outlined dense></v-text-field>
                    <v-btn variants="tonal" @click="confirm_delete">确认</v-btn>
                </div>
            </div>
            <div id="close" @click="handleClose">
                <v-icon size="25" icon="mdi-close"></v-icon>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage} from 'element-plus'
import { entry } from '@/ts/entry'
import "@/style/cui.scss"
const visible = ref(true);
const props = defineProps({
    name: {
        type: String,
        default: ""
    },
    input: {
        type: Boolean,
        default: true
    }
})
const emit = defineEmits(["confirm", "cancel"]);

function handleClose() {
    if (bg.value) bg.value.style.animation = "cui-dialog-disappear .3s ease-in";
    setTimeout(() => emit("cancel"), 300);
}

const confirm_delete_name = ref("");
const bg = ref<HTMLElement | null>(null);
onMounted(() => {
    const container = document.querySelector(".delete-confirm-container") as HTMLElement;
    if (container) entry("left", container, 70);
})
function confirm_delete() {
    if (!props.input) {
        emit("confirm")
        return;
    }
    if (confirm_delete_name.value == props.name) {
        emit("confirm")
    }
    else ElMessage({
        type: "error",
        message: "请输入名称"
    })
}
</script>

<style>
.delete-confirm-container {
    margin: 20px;
    display: flex;
    flex-direction: column;
}

.delete-confirm-button {
    align-self: flex-end;
}

.delete-warning-box {
    border-left: solid 7px var(--delete-box-left-border);
    border-radius: 7px;
    padding: 10px;
    background-color: var(--delete-box-bg);
    color: var(--delete-box-text);
    margin-bottom: 30px;
}

.delete-warning-box-title {
    font-size: 23px;
    margin-bottom: 10px;
    font-weight: 600;
    color: var(--delete-box-title);
}

.delete-warning-box-title .warning-icon {
    transform: translateY(3px);
    margin-right: 5px;
}
</style>

<style lang="scss" scoped>
#mask {
    z-index: 500;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(10px);
    animation: cui-dialog-blur .6s;
}

#bg {
    position: absolute;
    width: 60%;
    height: fit-content;
    max-width: 80%;
    border: solid var(--bd-color) 1px;
    background-color: var(--bg-color-solid);
    border-radius: 8px;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    animation: cui-dialog-appear .6s cubic-bezier(0, 0.6, 0.2, 1.0);
}

#content {
    padding: 20px;
    height: calc(100% - 40px);
    overflow: auto;
}

#close {
    position: absolute;
    right: 0;
    top: 0;
    margin: 15px;
    cursor: pointer;
}
</style>