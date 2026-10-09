import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
export default ts.config(
  { ignores: ['.nuxt/**', '.output/**', 'node_modules/**', '--host/**', 'coverage/**', 'server/generated/**'] },
  js.configs.recommended, ...ts.configs.recommended, ...vue.configs['flat/essential'],
  { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: ts.parser } } },
  { files: ['**/*.{ts,vue,mjs}'], languageOptions: { globals: Object.fromEntries([
    'process','console','URL','setTimeout','localStorage','window','document','fetch',
    'defineNuxtConfig','defineProps','defineEmits','computed','ref','watch','onMounted','nextTick',
    'useState','useRoute','useFetch','useHead','navigateTo','$fetch','definePageMeta'
  ].map(key => [key,'readonly'])) }, rules: { 'no-undef': 'off', 'vue/multi-word-component-names': 'off' } }
)
