<template>
  <v-btn
    @click="$emit('click')"
    color="orange darken-3 white--text"
    elevation="2"
    x-large
    rounded
    min-width="180"
    height="50"
    class="translate-btn"
  >
    <v-icon left>mdi-translate</v-icon>
    <span v-if="!loading">{{ text }}</span>
    <span v-else class="spinner"></span>
  </v-btn>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    text: String,
  },
};
</script>

<style scoped>
.btn {
  background-color: #6200ea;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid white;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
