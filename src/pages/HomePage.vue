<template>
  <div class="home-page">
    <div class="container">
      <h1>Planner App</h1>
      <p>Welcome to your personal planner application</p>
      
      <div class="demo-section">
        <h2>테스트 기능</h2>
        <p>프론트엔드와 백엔드 연동 테스트를 위한 랜덤 닉네임 생성기입니다.</p>
        <NicknameGenerator />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NicknameGenerator from '../features/NicknameGenerator.vue'
</script>

<style lang="scss" scoped>
.home-page {
  padding: $spacing-xl 0;
}

.demo-section {
  margin-top: $spacing-2xl;
  padding-top: $spacing-2xl;
  border-top: 1px solid #e2e8f0;

  h2 {
    text-align: center;
    color: $primary-color;
  }

  p {
    text-align: center;
    color: $text-secondary;
    margin-bottom: $spacing-xl;
  }
}
</style>