<script lang="ts" setup>
import anime from "animejs";
import { onMounted, ref } from "vue";

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

onMounted(()=>{
  anime({
    targets: ".problem-commit-animation",
    translateX: [20, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
  })
})
</script>

<template>
  <v-container>
    <div id="problem-commit-header" class="problem-commit-animation">
      <v-btn
        @click="back"
        icon="mdi-arrow-left"
        variant="text"
        density="comfortable"
      ></v-btn>
      <p id="problem-commit-title">题目A</p>
      <v-btn>提交</v-btn>
    </div>
    <div id="problem-commit-info" class="problem-commit-animation">
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
    <div id="problem-commit-upload">
      <div id="problem-commit-upload-title" class="problem-commit-animation">提交</div>
      <div id="problem-commit-upload-file">
        <v-card
          class="problem-commit-upload-cards"
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
        class="problem-commit-drop-zone problem-commit-animation"
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
#problem-commit-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
  width: 100%;
}

#problem-commit-title {
  font-size: 22px;
  font-weight: bold;
  margin-left: 12px;
  flex-grow: 1;
}

#problem-commit-info {
  margin-bottom: 20px;
}

/* #problem-commit-upload {
  display: flex;
  flex-direction: column;
} */

#problem-commit-upload-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
}

.problem-commit-drop-zone {
  border: 2px dashed var(--bd-color);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.problem-commit-drop-zone:hover {
  background-color: var(--bg-color-shallow);
}

.dragging {
  background-color: var(--bg-color-shallow);
}

.problem-commit-upload-cards {
  margin-bottom: 15px;
}
</style>
