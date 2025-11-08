<template>
  <div class="px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">笔记列表</h1>
      <router-link
        to="/notes/new"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新建笔记
      </router-link>
    </div>

    <!-- Notes Grid -->
    <div v-if="notes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="note in sortedNotes"
        :key="note.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
      >
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {{ note.title }}
          </h3>
          <div class="text-sm text-gray-600 mb-4">
            <div class="flex items-center mb-1">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>下次复习: {{ formatDate(note.nextReviewDate) }}</span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>复习次数: {{ note.repetitions }}</span>
            </div>
          </div>
          
          <!-- Note status badge -->
          <div class="mb-4">
            <span 
              v-if="isNeedReview(note)"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
            >
              需要复习
            </span>
            <span 
              v-else
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              已复习
            </span>
          </div>

          <!-- Action buttons -->
          <div class="flex space-x-2">
            <router-link
              :to="`/notes/${note.id}/edit`"
              class="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 text-center"
            >
              编辑
            </router-link>
            <button
              @click="confirmDelete(note)"
              class="flex-1 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">暂无笔记</h3>
      <p class="mt-1 text-sm text-gray-500">开始创建您的第一个笔记吧！</p>
      <div class="mt-6">
        <router-link
          to="/notes/new"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          新建笔记
        </router-link>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 class="text-xl font-bold mb-4">确认删除</h2>
        <p class="text-gray-600 mb-6">
          确定要删除笔记 "{{ noteToDelete?.title }}" 吗？此操作无法撤销。
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            取消
          </button>
          <button
            @click="deleteNote"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span class="text-gray-700">加载中...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNoteStore } from '../stores/noteStore.js';

const noteStore = useNoteStore();

const showDeleteModal = ref(false);
const noteToDelete = ref(null);

const notes = computed(() => noteStore.notes);
const isLoading = computed(() => noteStore.isLoading);

// Sort notes by next review date (urgent first)
const sortedNotes = computed(() => {
  return [...notes.value].sort((a, b) => {
    return new Date(a.nextReviewDate) - new Date(b.nextReviewDate);
  });
});

onMounted(async () => {
  await noteStore.fetchNotes();
});

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const noteDate = new Date(date);
  noteDate.setHours(0, 0, 0, 0);
  
  const diffTime = noteDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '明天';
  if (diffDays === -1) return '昨天';
  if (diffDays < 0) return `${Math.abs(diffDays)} 天前`;
  
  return `${diffDays} 天后`;
}

function isNeedReview(note) {
  const today = new Date().toISOString().split('T')[0];
  return note.nextReviewDate <= today;
}

function confirmDelete(note) {
  noteToDelete.value = note;
  showDeleteModal.value = true;
}

async function deleteNote() {
  if (noteToDelete.value) {
    await noteStore.deleteNote(noteToDelete.value.id);
    showDeleteModal.value = false;
    noteToDelete.value = null;
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
