<template>
  <form class="hidden md:block max-w-6xl mx-auto mb-16">
    <div
      class="relative h-full w-full focus:ring-indigo-500 focus:border-indigo-500
    shadow-sm text-2xl border-gray-300 bg-gray-200 rounded-xl px-7 py-7 bg-opacity-70"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="absolute transform -translate-y-1/2 top-1/2 left-4 h-auto w-10"
        style="color: #4A5568;"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12C10.2091 12 12
        10.2091 12 8C12 5.79086 10.2091 4 8 4ZM2 8C2 4.68629 4.68629 2 8
        2C11.3137 2 14 4.68629 14 8C14 9.29583 13.5892 10.4957 12.8907
        11.4765L17.7071 16.2929C18.0976 16.6834 18.0976 17.3166 17.7071
        17.7071C17.3166 18.0976 16.6834 18.0976 16.2929 17.7071L11.4765
        12.8907C10.4957 13.5892 9.29583 14 8 14C4.68629 14 2 11.3137 2 8Z"
          fill="currentcolor"
        />
      </svg>

      <input
        class="h-full block bg-transparent relative left-10 border-none
      outline-none search-input"
        placeholder="Ex. React"
        @input="handleInputChange"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { debounce } from "../utils";

export default defineComponent({
  name: "SearchBar",
  setup(props, context) {
    const handleInputChange = debounce((evt: Event) => {
      const element = evt.target as HTMLInputElement;

      context.emit("search", element.value);
    }, 300);

    return {
      handleInputChange
    };
  }
});
</script>

<style scoped>
.search-input {
  width: calc(100% - 3.5rem);
}
</style>
