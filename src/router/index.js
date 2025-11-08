import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../components/Dashboard.vue';
import NoteList from '../components/NoteList.vue';
import NoteEditor from '../components/NoteEditor.vue';
import ReviewReader from '../components/ReviewReader.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/notes',
    name: 'NoteList',
    component: NoteList
  },
  {
    path: '/notes/new',
    name: 'NoteNew',
    component: NoteEditor,
    props: { mode: 'new' }
  },
  {
    path: '/notes/:id/edit',
    name: 'NoteEdit',
    component: NoteEditor,
    props: route => ({ mode: 'edit', noteId: route.params.id })
  },
  {
    path: '/review',
    name: 'Review',
    component: ReviewReader
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
