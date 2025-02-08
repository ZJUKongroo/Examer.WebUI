<template>
  <v-container>
    <UniversalHeader title="Candidate Management">
      <template #append>
        <v-btn>Save</v-btn>
      </template>
    </UniversalHeader>
    <div class="exam-candidate-flex-container">
      <div class="exam-candidate-list-container">
        <v-text-field v-model="searchQuery" label="Search candidates..." solo></v-text-field>
        <v-btn @click="selectAllCandidates" class="mb-4">全选</v-btn>
        <v-list>
          <v-list-item
            v-for="candidate in filteredCandidates"
            :key="candidate.id"
            @click="toggleCandidateSelection(candidate)"
            :class="{ 'selected': isSelected(candidate) }"
          >
            <v-list-item-content>
              <v-list-item-title>{{ candidate.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
      <div class="exam-candidate-selected-container">
        <v-list>
          <v-list-item
            v-for="candidate in filteredSelectedCandidates"
            :key="candidate.id"
            @click="toggleCandidateSelection(candidate)"
            :class="{ 'selected': isSelected(candidate) }"
          >
            <v-list-item-content>
              <v-list-item-title>{{ candidate.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import UniversalHeader from '~/components/UniversalHeader.vue';

interface Candidate {
  id: number;
  name: string;
}

const searchQuery = ref('');
const selectedSearchQuery = ref('');
const candidates = ref<Candidate[]>([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Alice Johnson' },
  // Add more candidates as needed
]);
const selectedCandidates = ref<Candidate[]>([]);

const filteredCandidates = computed(() => {
  return candidates.value.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredSelectedCandidates = computed(() => {
  return selectedCandidates.value.filter(candidate =>
    candidate.name.toLowerCase().includes(selectedSearchQuery.value.toLowerCase())
  );
});

const toggleCandidateSelection = (candidate: Candidate) => {
  const index = selectedCandidates.value.findIndex(c => c.id === candidate.id);
  if (index === -1) {
    selectedCandidates.value.push(candidate);
    candidates.value = candidates.value.filter(c => c.id !== candidate.id);
  } else {
    candidates.value.push(candidate);
    selectedCandidates.value.splice(index, 1);
  }
};

const isSelected = (candidate: Candidate) => {
  return selectedCandidates.value.some(c => c.id === candidate.id);
};

const selectAllCandidates = () => {
  selectedCandidates.value = [...filteredCandidates.value];
  candidates.value = candidates.value.filter(candidate =>
    !filteredCandidates.value.includes(candidate)
  );
};

function getUser()  {
  return {
    name: 'John Doe',
    role: 'Admin',
  };
}
</script>

<style scoped>
.exam-candidate-flex-container {
  display: flex;
  gap: 20px;
}

.exam-candidate-list-container,
.exam-candidate-selected-container {
  flex: 1;
}

.selected {
  background-color: #e0e0e0;
}
</style>
