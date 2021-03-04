<template>
  <a
    class="relative flex flex-col min-w-0 break-words bg-white w-full px-8 py-4 shadow-lg rounded-xl mx-auto border-green-500 transform transition-transform hover:-translate-y-2 focus:translate-y-2 overflow-x-hidden h-40 repository"
    :href="repository.node.url"
    target="_blank"
  >
    <div
      class="absolute w-68 h-full -right-4 top-0 bg-gradient-to-bl from-green-600 via-green-50 to-white"
    ></div>
    <div class="absolute w-68 h-full right-0 top-0 text-green-500">
      <div class="v-full h-full opacity-50 dots-pattern">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <circle fill="currentcolor" cx="2" cy="2" r="1"></circle>
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)"></rect>
        </svg>
      </div>
    </div>
    <div class="min-w-0 relative flex-auto sm:pr-20 lg:pr-0 xl:pr-20">
      <h2 class="text-2xl font-bold text-black mb-2 flex items-center">
        <img
          class="rounded-full h-8 w-8 inline-block mr-2"
          :src="repository.node.owner.avatarUrl"
        />{{ repository.node.owner.login }} / {{ repository.node.name }}
      </h2>
      <p class="mb-2 w-10/12 truncate" v-if="repository.node.description">
        {{ repository.node.description }}
      </p>
      <p v-else class="mb-2 font-medium text-gray-400">
        -- No Description Found.
      </p>
      <dl class="flex flex-wrap text-sm font-medium whitespace-pre mb-2">
        <div class="metadata">
          <dt class="sr-only">Primary Language</dt>
          <dd class="inline">
            <span
              v-if="repository.node.primaryLanguage"
              class="flex items-center"
            >
              <span
                class="inline-block h-4 w-4 rounded-full align-middle mr-1 relative"
                :style="{
                  backgroundColor: `${repository.node.primaryLanguage.color}4D`
                }"
              >
                <span
                  class="absolute block h-2 w-2 transform top-2/4 -translate-y-2/4 left-2/4 -translate-x-2/4 rounded-full"
                  :style="{
                    backgroundColor: repository.node.primaryLanguage.color
                  }"
                ></span>
              </span>
              <span class="align-middle">{{
                repository.node.primaryLanguage.name
              }}</span>
            </span>
            <span v-else>Text</span>
          </dd>
        </div>
        <div
          class="metadata"
          v-if="
            repository.node.licenseInfo &&
              repository.node.licenseInfo.name !== 'Other'
          "
        >
          <dt class="sr-only">License</dt>
          <dd class="inline">{{ repository.node.licenseInfo.name }}</dd>
        </div>
        <div class="metadata">
          <dt class="sr-only">Last Updated</dt>
          <dd class="inline capitalize">
            Updated {{ formatUpdatedAt(repository.node.updatedAt) }}
          </dd>
        </div>
        <div
          class="absolute top-0 right-0 hidden sm:flex lg:hidden xl:flex items-end space-x-1 flex-col"
        >
          <dt class="flex items-center mb-2">
            <span class="uppercase tracking-widest h5 block mr-1 font-semibold"
              >Stargazers</span
            >
            <button
              class="relative rounded-full focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500"
              type="button"
              @click="handleStarBtnClick"
            >
              <span class="sr-only">Add to favorites</span>
              <svg
                class="h-6 w-6"
                :class="{
                  'text-black': repository.node.viewerHasStarred,
                  'text-gray-300': !repository.node.viewerHasStarred
                }"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </button>
          </dt>
          <dd
            class="text-6xl font-bold tracking-wide relative stargazers-count"
          >
            <span class="relative">{{
              repository.node.stargazers.totalCount
            }}</span>
          </dd>
        </div>
      </dl>
      <div class="flex-none w-full">
        <span class="sr-only">Topics</span>
        <ul
          class="truncate"
          v-if="repository.node.repositoryTopics.edges.length > 0"
        >
          <li
            class="inline-block mr-2"
            v-for="topic in repository.node.repositoryTopics.edges"
            :key="topic.node.topic.name"
          >
            <span
              class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >{{ topic.node.topic.name }}</span
            >
          </li>
        </ul>
        <p v-else class="font-medium text-gray-400">-- No Tags Found.</p>
      </div>
    </div>
  </a>
</template>
<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { useMutation } from "@vue/apollo-composable";
import {
  AddStarPayload,
  AddStarInput,
  RemoveStarPayload,
  RemoveStarInput,
  Repository,
  SearchResultItemConnection
} from "@octokit/graphql-schema";
import { formatDistance } from "date-fns";
import { SEARCH_REPOS, ADD_STAR, REMOVE_STAR } from "../graphql/documents";
import { ApolloCache } from "@apollo/client/core";

interface CacheData {
  [propName: string]: AddStarPayload | RemoveStarPayload;
}

interface QueryVariables {
  [propName: string]: number | string;
}

export default defineComponent({
  name: "Repository",
  props: {
    repository: {
      type: Object,
      required: true
    },
    searchOptions: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    let selectedId: string;
    const { repository, searchOptions } = toRefs(props);

    const overrideMutationStarCache = (
      mutation: string,
      cache: ApolloCache<CacheData>,
      data: CacheData | null | undefined,
      queryVariables: QueryVariables,
      calcNewTotal: (totalCount: number) => number
    ) => {
      const cachedData = cache.readQuery<{
        search: SearchResultItemConnection;
      }>({
        query: SEARCH_REPOS,
        variables: queryVariables
      });

      cache.writeQuery({
        query: SEARCH_REPOS,
        data: Object.assign({}, cachedData, {
          search: {
            edges: cachedData!.search.edges!.map(edge => {
              const repo = edge!.node as Repository;
              const clonedRepo = {
                ...repo,
                stargazers: { ...repo.stargazers }
              };

              if (clonedRepo.id === data![mutation].starrable!.id) {
                clonedRepo.viewerHasStarred = data![
                  mutation
                ].starrable!.viewerHasStarred;
                clonedRepo.stargazers.totalCount = calcNewTotal(
                  clonedRepo.stargazers.totalCount
                );
              }

              return {
                ...edge,
                node: clonedRepo
              };
            })
          }
        })
      });
    };

    const { mutate: starRepo } = useMutation<
      { addStar: AddStarPayload },
      { repositoryId: AddStarInput["starrableId"] }
    >(ADD_STAR, () => ({
      variables: {
        repositoryId: selectedId
      },
      update: (cache, { data }) => {
        overrideMutationStarCache(
          "addStar",
          cache,
          data,
          searchOptions.value,
          totalCount => totalCount + 1
        );
      }
    }));

    const { mutate: unstarRepo } = useMutation<
      {
        removeStar: RemoveStarPayload;
      },
      { repositoryId: RemoveStarInput["starrableId"] }
    >(REMOVE_STAR, () => ({
      variables: {
        repositoryId: selectedId
      },
      update: (cache, { data }) => {
        overrideMutationStarCache(
          "removeStar",
          cache,
          data,
          searchOptions.value,
          totalCount => totalCount - 1
        );
      }
    }));

    const formatUpdatedAt = (updatedAt: string) => {
      return formatDistance(new Date(updatedAt), new Date(), {
        addSuffix: true
      });
    };

    const handleStarBtnClick = (evt: Event) => {
      evt.stopPropagation();
      evt.preventDefault();

      const { id, viewerHasStarred } = repository.value.node;

      selectedId = id;

      if (viewerHasStarred) {
        unstarRepo();
      } else {
        starRepo();
      }
    };

    return {
      formatUpdatedAt,
      handleStarBtnClick
    };
  }
});
</script>

<style scoped>
.repository {
  border-left-width: 0.75rem;
}

.metadata:not(:first-child)::before {
  content: "∙";
  margin: 0 0.375rem;
}

.dots-pattern::after {
  content: "";
  position: absolute;
  z-index: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(
    to top left,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 50%
  );
}

.stargazers-count::before {
  content: "";
  height: 2rem;
  width: calc(100% + 2rem);
  position: absolute;
  bottom: -0.75rem;
  right: 0;
  background-color: rgba(16, 185, 129, 0.5);
}
</style>
