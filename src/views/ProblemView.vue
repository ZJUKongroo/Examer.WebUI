<script lang="ts" setup>
import { ref } from "vue";

const files = ref<File[]>([]);
const problemInfo = ref<{ title: string; description: string } | null>({
  title: "title",
  description: "description",
});
const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const handleFileUpload = (newFiles: FileList) => {
  for (let i = 0; i < newFiles.length; i++) {
    files.value.push(newFiles[i]);
  }
};

const handleDrop = (event: DragEvent) => {
  const droppedFiles = event.dataTransfer?.files;
  if (droppedFiles && droppedFiles.length > 0) {
    handleFileUpload(droppedFiles);
  }
};

function back() {
  window.history.back();
}

function removeFile(index: number) {
  files.value.splice(index, 1);
}

function handleFileSelect() {
  const newFiles = fileInputRef.value?.files;
  if (newFiles) {
    handleFileUpload(newFiles);
  }
}
</script>

<template>
  <v-container>
    <div id="problem-header">
      <v-btn
        @click="back"
        icon="mdi-arrow-left"
        variant="text"
        density="comfortable"
      ></v-btn>
      <p id="problem-title">题目A</p>
    </div>
    <div id="problem-info">
      <v-card>
        <v-card-title>Problem Information</v-card-title>
        <v-card-text>
          <div v-if="problemInfo">
            <p><strong>Description:</strong> {{ problemInfo.description }}</p>
          </div>
          <div v-else>
            <p>No problem information available.</p>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <div id="problem-upload">
      <div id="problem-upload-title">提交</div>
      <div id="problem-upload-file">
        <v-card
          class="problem-upload-cards"
          :title="file.name"
          v-for="(file, index) in files"
          :key="index"
        >
          <template v-slot:append>
            <v-btn
              @click="removeFile(index)"
              icon="mdi-close"
              variant="text"
            ></v-btn>
          </template>
        </v-card>
      </div>
      <div
        class="problem-drop-zone"
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @click="fileInputRef?.click()"
        :class="{ dragging: isDragging }"
      >
        <p>Drag and drop a file here, or click to select a file</p>
      </div>
      <input
        ref="fileInputRef"
        type="file"
        @change="handleFileSelect"
        multiple
        style="display: none"
      />
    </div>
  </v-container>
</template>

<style>
#problem-header {
  display: flex;
  width: fit-content;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
}

#problem-title {
  font-size: 22px;
  font-weight: bold;
  margin-left: 12px;
}

#problem-info {
  margin-bottom: 20px;
}

/* #problem-upload {
  display: flex;
  flex-direction: column;
} */

#problem-upload-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
}

.problem-drop-zone {
  border: 2px dashed var(--bd-color);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.problem-drop-zone:hover {
  background-color: var(--bg-color-shallow);
}

.dragging {
  background-color: var(--bg-color-shallow);
}

.problem-upload-cards {
  margin-bottom: 15px;
}
</style>
