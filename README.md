# scroll-select
基于Elemen-Plus的大数据下拉框实现

## 背景
项目中存在下拉框中数据量过大，导致点开下拉框时页面出现卡顿的情况。Element-Plus的2.x.x版本包含了`select-v2`组件来处理这种问题，但是目前还处于测试阶段，加上因为一些其他原因，项目中Element-Plus还停留在1.x.x版本不能升级， 所以暂时自己实现一个大数据量的下拉框来解决问题。

## 技术栈
- [Vue3.x](https://v3.vuejs.org/guide/introduction.html): 使用 `Vue3.x` 框架，支持 `<script setup>` 语法;

- [TypeScript](https://github.com/microsoft/TypeScript): 使用 `TypeScript` 进行类型注解;

- [Vite.js](https://vitejs.dev/): 使用 `Vite.js` 进行打包构建；


## 开发指南

### 1. 安装依赖

#### NPM
```sh
npm install
```
#### YARN
```sh
yarn install
```

### 2. 启动

#### NPM
```sh
npm run dev
```
#### YARN
```sh
yarn dev
```