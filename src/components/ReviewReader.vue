<template>
  <div class="px-4 py-6">
    <div class="max-w-4xl mx-auto">
      <!-- Review Progress -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg font-semibold text-gray-700">
            复习进度: {{ currentIndex + 1 }} / {{ reviewNotes.length }}
          </h2>
          <router-link
            to="/"
            class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            返回首页
          </router-link>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentIndex / reviewNotes.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- No Notes to Review -->
      <div v-if="reviewNotes.length === 0" class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-xl font-medium text-gray-900">太棒了！</h3>
        <p class="mt-2 text-gray-600">今天没有需要复习的笔记</p>
        <router-link
          to="/"
          class="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          返回首页
        </router-link>
      </div>

      <!-- Review Card -->
      <div v-else-if="currentNote" class="bg-white rounded-lg shadow-lg">
        <!-- Timer Bar -->
        <div v-if="isReading" class="bg-blue-50 p-4 rounded-t-lg border-b border-blue-100">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-blue-900">强制阅读时间</span>
            <span class="text-sm font-bold text-blue-600">{{ remainingTime }}秒</span>
          </div>
          <div class="w-full bg-blue-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              :style="{ width: `${(remainingTime / 15) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Note Content -->
        <div class="p-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ currentNote.title }}</h1>

          <!-- Tab Navigation -->
          <div class="flex border-b border-gray-200 mb-6">
            <button
              @click="activeTab = 'summary'"
              :class="[
                'px-4 py-2 font-medium text-sm border-b-2 transition-colors',
                activeTab === 'summary'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              AI摘要
            </button>
            <button
              @click="activeTab = 'original'"
              :class="[
                'px-4 py-2 font-medium text-sm border-b-2 transition-colors',
                activeTab === 'original'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              原文
            </button>
          </div>

          <!-- Content Display -->
          <div class="prose max-w-none">
            <!-- AI Summary Tab -->
            <div v-if="activeTab === 'summary'" class="min-h-[300px]">
              <div v-if="currentNote.aiSummary" class="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {{ currentNote.aiSummary }}
              </div>
              <div v-else class="text-gray-500 italic">
                暂无AI摘要，请检查API Key设置或等待生成完成。
              </div>
            </div>

            <!-- Original Content Tab -->
            <div v-if="activeTab === 'original'" class="min-h-[300px]" v-html="currentNote.content"></div>
          </div>
        </div>

        <!-- Review Buttons -->
        <div class="p-6 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <div v-if="isReading" class="text-center text-gray-600">
            <p class="text-sm">请仔细阅读内容，{{ remainingTime }} 秒后可以评价...</p>
          </div>
          <div v-else class="grid grid-cols-3 gap-4">
            <button
              @click="submitReview('failed')"
              class="px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              ❌ 忘记了
            </button>
            <button
              @click="submitReview('hard')"
              class="px-6 py-3 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
            >
              🤔 模糊
            </button>
            <button
              @click="submitReview('good')"
              class="px-6 py-3 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              ✅ 记住了
            </button>
          </div>
        </div>
      </div>

      <!-- Completion Message -->
      <div v-if="reviewCompleted" class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-xl font-medium text-gray-900">复习完成！</h3>
        <p class="mt-2 text-gray-600">今天的复习任务已全部完成</p>
        <div class="mt-6 space-x-4">
          <router-link
            to="/"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回首页
          </router-link>
          <router-link
            to="/notes"
            class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            查看笔记
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useNoteStore } from '../stores/noteStore.js';

const noteStore = useNoteStore();

const currentIndex = ref(0);
const activeTab = ref('summary');
const isReading = ref(true);
const remainingTime = ref(15);
const reviewCompleted = ref(false);
let timer = null;

const reviewNotes = computed(() => noteStore.todayReviewNotes);
const currentNote = computed(() => reviewNotes.value[currentIndex.value] || null);

onMounted(async () => {
  await noteStore.fetchNotes();
  
  if (reviewNotes.value.length > 0) {
    startReadingTimer();
  }
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});

function startReadingTimer() {
  isReading.value = true;
  remainingTime.value = 15;
  
  timer = setInterval(() => {
    remainingTime.value--;
    
    if (remainingTime.value <= 0) {
      clearInterval(timer);
      isReading.value = false;
    }
  }, 1000);
}

async function submitReview(quality) {
  try {
    await noteStore.submitReview(currentNote.value.id, quality);
    
    // Move to next note
    currentIndex.value++;
    
    // Check if all notes are reviewed
    if (currentIndex.value >= reviewNotes.value.length) {
      reviewCompleted.value = true;
    } else {
      // Reset for next note
      activeTab.value = 'summary';
      startReadingTimer();
    }
  } catch (error) {
    console.error('Failed to submit review:', error);
    alert('提交失败: ' + error.message);
  }
}
</script>
