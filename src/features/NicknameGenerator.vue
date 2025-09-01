<template>
  <div class="nickname-generator">
    <div class="card">
      <h2>랜덤 닉네임 생성기</h2>
      <p>버튼을 클릭하여 랜덤한 닉네임을 생성해보세요!</p>
      
      <div class="nickname-display">
        <div v-if="currentNickname" class="nickname-result">
          <h3>생성된 닉네임:</h3>
          <div class="nickname">{{ currentNickname }}</div>
        </div>
        <div v-else class="nickname-placeholder">
          닉네임이 여기에 표시됩니다
        </div>
      </div>

      <div class="button-group">
        <button 
          class="btn btn-primary" 
          @click="generateSingleNickname"
          :disabled="loading"
        >
          {{ loading ? '생성 중...' : '랜덤 닉네임 생성' }}
        </button>
        
        <button 
          class="btn btn-secondary" 
          @click="generateMultipleNicknames"
          :disabled="loading"
        >
          {{ loading ? '생성 중...' : '5개 닉네임 생성' }}
        </button>
      </div>

      <div v-if="multipleNicknames.length > 0" class="multiple-nicknames">
        <h4>생성된 닉네임들:</h4>
        <div class="nickname-list">
          <span 
            v-for="(nickname, index) in multipleNicknames" 
            :key="index" 
            class="nickname-item"
            @click="selectNickname(nickname)"
          >
            {{ nickname }}
          </span>
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { nicknameApi } from '../shared/api/nickname.api'

const currentNickname = ref<string>('')
const multipleNicknames = ref<string[]>([])
const loading = ref<boolean>(false)
const error = ref<string>('')

const generateSingleNickname = async () => {
  loading.value = true
  error.value = ''
  multipleNicknames.value = []
  
  try {
    const response = await nicknameApi.getRandomNickname()
    currentNickname.value = response.nickname
  } catch (err) {
    error.value = '닉네임 생성에 실패했습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
    console.error('Error generating nickname:', err)
  } finally {
    loading.value = false
  }
}

const generateMultipleNicknames = async () => {
  loading.value = true
  error.value = ''
  currentNickname.value = ''
  
  try {
    const response = await nicknameApi.getMultipleNicknames(5)
    multipleNicknames.value = response.nicknames
  } catch (err) {
    error.value = '닉네임 생성에 실패했습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
    console.error('Error generating nicknames:', err)
  } finally {
    loading.value = false
  }
}

const selectNickname = (nickname: string) => {
  currentNickname.value = nickname
  multipleNicknames.value = []
}
</script>

<style lang="scss" scoped>
.nickname-generator {
  max-width: 600px;
  margin: 0 auto;
  padding: $spacing-lg;
}

.nickname-display {
  margin: $spacing-lg 0;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nickname-result {
  text-align: center;

  h3 {
    margin-bottom: $spacing-sm;
    color: $text-secondary;
  }
}

.nickname {
  font-size: 2rem;
  font-weight: $font-weight-bold;
  color: $primary-color;
  padding: $spacing-md;
  background-color: $surface-color;
  border-radius: $border-radius-lg;
  border: 2px solid $primary-color;
}

.nickname-placeholder {
  color: $text-secondary;
  font-style: italic;
  text-align: center;
}

.button-group {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  flex-wrap: wrap;
}

.multiple-nicknames {
  margin-top: $spacing-lg;
  padding-top: $spacing-lg;
  border-top: 1px solid #e2e8f0;

  h4 {
    margin-bottom: $spacing-md;
    text-align: center;
  }
}

.nickname-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  justify-content: center;
}

.nickname-item {
  padding: $spacing-sm $spacing-md;
  background-color: $surface-color;
  border: 1px solid #e2e8f0;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: $font-weight-medium;

  &:hover {
    background-color: $primary-color;
    color: white;
    border-color: $primary-color;
  }
}

.error-message {
  margin-top: $spacing-md;
  padding: $spacing-md;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: $border-radius-md;
  text-align: center;
}

.btn {
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>