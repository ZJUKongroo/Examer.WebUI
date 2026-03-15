<template>
  <v-dialog v-model="visible" max-width="560" persistent>
    <v-card>
      <v-card-title class="text-h6">{{ options.title }}</v-card-title>

      <v-card-text>
        <div class="confirm-message">{{ options.message }}</div>

        <v-alert
          v-if="options.warningText"
          type="warning"
          variant="tonal"
          class="mt-4"
        >
          {{ options.warningText }}
        </v-alert>

        <v-text-field
          v-if="options.requireInput"
          v-model="inputValue"
          class="mt-4"
          :label="options.inputLabel || '输入确认内容'"
          variant="outlined"
          density="comfortable"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" color="grey-darken-1" @click="onCancel">
          {{ options.cancelText || '取消' }}
        </v-btn>
        <v-btn variant="tonal" :color="options.confirmColor || 'primary'" @click="onConfirm">
          {{ options.confirmText || '确认' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import appMessage from "~/services/message.service";

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  warningText?: string;
  requireInput?: boolean;
  expectedInput?: string;
  inputLabel?: string;
  inputErrorText?: string;
}

const props = defineProps<{
  options: ConfirmDialogOptions;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const visible = ref(true);
const inputValue = ref("");

function onConfirm() {
  if (props.options.requireInput) {
    if (inputValue.value !== (props.options.expectedInput || "")) {
      appMessage.error(props.options.inputErrorText || "输入内容不正确");
      return;
    }
  }
  visible.value = false;
  emit("confirm");
}

function onCancel() {
  visible.value = false;
  emit("cancel");
}
</script>

<style scoped>
.confirm-message {
  white-space: pre-line;
}
</style>