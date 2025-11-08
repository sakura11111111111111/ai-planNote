<template>
  <div class="px-4 py-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ mode === 'new' ? '创建笔记' : '编辑笔记' }}
        </h1>
        <router-link
          to="/notes"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          返回列表
        </router-link>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <!-- Title Input -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            标题
          </label>
          <input
            v-model="title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入笔记标题..."
          />
        </div>

        <!-- TipTap Editor Toolbar -->
        <div v-if="editor" class="mb-2 flex flex-wrap gap-1 p-2 border border-gray-300 rounded-t-md bg-gray-50">
          <button
            @click="editor.chain().focus().toggleBold().run()"
            :class="{ 'bg-blue-200': editor.isActive('bold') }"
            class="p-2 rounded hover:bg-gray-200 transition-colors"
            title="粗体"
          >
            <strong>B</strong>
          </button>
          <button
            @click="editor.chain().focus().toggleItalic().run()"
            :class="{ 'bg-blue-200': editor.isActive('italic') }"
            class="p-2 rounded hover:bg-gray-200 transition-colors"
            title="斜体"
          >
            <em>I</em>
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'bg-blue-200': editor.isActive('heading', { level: 1 }) }"
            class="p-2 rounded hover:bg-gray-200 transition-colors"
            title="标题1"
          >
            H1
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'bg-blue-200': editor.isActive('heading', { level: 2 }) }"
            class="p-2 rounded hover:bg-gray-200 transition-colors"
            title="标题2"
          >
            H2
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'bg-blue-200': editor.isActive('heading', { level: 3 }) }"
            class="p-2 rounded hover:bg-gray-200 transition-colors"
            title="标题3"
          >
            H3
          </button>
          <button
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'bg-blue-200': editor.isActive('bulletList') }"
            class="p-2 rounded hover:bg-gray-200 transition-colors"
            title="无序列表"
          >
            • List
          </button>
          <button
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'bg-blue-200': editor.isActive('orderedList') }"
            class="p-2 rounded hover:bg-gray-200 transition-colors"
            title="有序列表"
          >
            1. List
          </button>
          <button
            @click="setLink"
            :class="{ 'bg-blue-200': editor.isActive('link') }"
            class="p-2 rounded hover:bg-gray-200 transition-colors"
            title="链接"
          >
            🔗
          </button>
          <button
            @click="addImage"
            class="p-2 rounded hover:bg-gray-200 transition-colors"
            title="图片"
          >
            🖼️
          </button>
          <input
            ref="imageInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageUpload"
          />
        </div>

        <!-- TipTap Editor Content -->
        <editor-content :editor="editor" />

        <!-- Action Buttons -->
        <div class="mt-6 flex justify-end space-x-3">
          <router-link
            to="/notes"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            取消
          </router-link>
          <button
            @click="saveNote"
            :disabled="!title.trim() || isSaving"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ isSaving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
        笔记已保存成功！
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useNoteStore } from '../stores/noteStore.js';

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['new', 'edit'].includes(value)
  },
  noteId: {
    type: String,
    default: null
  }
});

const router = useRouter();
const noteStore = useNoteStore();

const title = ref('');
const isSaving = ref(false);
const showSuccess = ref(false);
const imageInput = ref(null);

// Initialize TipTap editor
const editor = useEditor({
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
    }),
    Image.configure({
      inline: true,
    }),
  ],
  content: '',
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
  },
});

onMounted(async () => {
  if (props.mode === 'edit' && props.noteId) {
    const note = await noteStore.loadNote(props.noteId);
    if (note) {
      title.value = note.title;
      if (editor.value) {
        editor.value.commands.setContent(note.content);
      }
    } else {
      alert('笔记未找到');
      router.push('/notes');
    }
  }
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

function setLink() {
  const previousUrl = editor.value.getAttributes('link').href;
  const url = window.prompt('输入链接URL:', previousUrl);

  if (url === null) {
    return;
  }

  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
}

function addImage() {
  imageInput.value.click();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const url = URL.createObjectURL(file);
    editor.value.chain().focus().setImage({ src: url }).run();
  }
}

async function saveNote() {
  if (!title.value.trim()) {
    alert('请输入标题');
    return;
  }

  isSaving.value = true;

  try {
    const content = editor.value.getHTML();
    
    if (props.mode === 'new') {
      await noteStore.createNote({
        title: title.value,
        content: content
      });
    } else {
      const note = await noteStore.loadNote(props.noteId);
      await noteStore.updateNote({
        ...note,
        title: title.value,
        content: content
      });
    }

    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
      router.push('/notes');
    }, 1500);
  } catch (error) {
    console.error('Failed to save note:', error);
    alert('保存失败: ' + error.message);
  } finally {
    isSaving.value = false;
  }
}
</script>
