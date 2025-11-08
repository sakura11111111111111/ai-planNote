<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-bold text-blue-600">
              智能艾宾浩斯复习笔记
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <router-link 
              to="/" 
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              active-class="bg-blue-50 text-blue-600"
            >
              仪表盘
            </router-link>
            <router-link 
              to="/notes" 
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              active-class="bg-blue-50 text-blue-600"
            >
              笔记列表
            </router-link>
            <router-link 
              to="/review" 
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              active-class="bg-blue-50 text-blue-600"
            >
              开始复习
            </router-link>
            <button
              @click="showSettings = true"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              设置
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view />
    </main>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 class="text-xl font-bold mb-4">设置</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            OpenAI API Key
          </label>
          <input
            v-model="apiKey"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="sk-..."
          />
          <p class="mt-1 text-sm text-gray-500">
            用于生成笔记摘要。您的 API Key 将安全存储在本地浏览器中。
          </p>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            @click="showSettings = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            取消
          </button>
          <button
            @click="saveSettings"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showSettings = ref(false);
const apiKey = ref('');

onMounted(() => {
  apiKey.value = localStorage.getItem('openaiApiKey') || '';
});

function saveSettings() {
  localStorage.setItem('openaiApiKey', apiKey.value);
  showSettings.value = false;
  alert('设置已保存！');
}
</script>
