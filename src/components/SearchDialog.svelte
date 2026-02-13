<script lang="ts">
  import { onMount } from 'svelte';
  import { uiState } from '@/lib/ui.svelte';

  interface PagefindResult {
    id: string;
    url: string;
    excerpt: string;
    meta: {
      title?: string;
      image?: string;
    };
    sub_results?: {
      title: string;
      url: string;
      excerpt: string;
    }[];
  }

  let pagefind: any = $state(null);
  let results = $state<PagefindResult[]>([]);
  let query = $state('');
  let loading = $state(false);
  let selectedIndex = $state(0);

  let searchInput = $state<HTMLInputElement>();
  let resultsList = $state<HTMLDivElement>();
  let debounceTimer: ReturnType<typeof setTimeout>;

  $effect(() => {
    if (uiState.isSearchOpen && searchInput) {
      setTimeout(() => searchInput?.focus(), 10);
    }
  });

  $effect(() => {
    if (!uiState.isSearchOpen) {
      query = '';
      results = [];
      selectedIndex = 0;
    }
  });

  async function search(q: string) {
    if (!pagefind || q.length === 0) {
      results = [];
      selectedIndex = 0;
      return;
    }

    loading = true;
    try {
      const searchResult = await pagefind.search(q);
      const data = await Promise.all(searchResult.results.slice(0, 10).map((r: any) => r.data()));
      results = data;
      selectedIndex = 0;
    } catch (err) {
      console.error('Pagefind search error:', err);
      results = [];
    } finally {
      loading = false;
    }
  }

  function handleInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => search(query), 150);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      uiState.closeSearch();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
      scrollToSelected();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      scrollToSelected();
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      window.location.href = results[selectedIndex].url;
      uiState.closeSearch();
    }
  }

  function scrollToSelected() {
    if (resultsList) {
      const el = resultsList.querySelector(`[data-index="${selectedIndex}"]`);
      el?.scrollIntoView({ block: 'nearest' });
    }
  }

  onMount(() => {
    (async () => {
      try {
        // Pagefind assets are generated post-build; load at runtime only
        const pf = await import(
          /* @vite-ignore */ `${window.location.origin}/pagefind/pagefind.js`
        );
        await pf.init();
        pagefind = pf;
      } catch (err) {
        console.error('Failed to load Pagefind:', err);
      }
    })();

    return () => {
      clearTimeout(debounceTimer);
    };
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="fixed inset-0 z-[100] flex items-start justify-center pt-8 sm:pt-24 px-4 bg-black/40 backdrop-blur-[4px] transition-all"
  onclick={() => uiState.closeSearch()}
>
  <div
    class="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    onclick={(e) => e.stopPropagation()}
    onkeydown={handleKeydown}
  >
    <div class="flex items-center gap-3 p-4 sm:p-6 border-b border-border bg-background/50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
      <input
        bind:this={searchInput}
        bind:value={query}
        oninput={handleInput}
        type="text"
        placeholder="Search posts, pages, and content..."
        class="flex-1 bg-transparent border-none outline-none text-base sm:text-lg text-foreground placeholder:text-muted-foreground/40 font-medium"
      />
      {#if loading}
        <div
          class="w-5 h-5 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin"
        ></div>
      {/if}
      <button
        onclick={() => uiState.closeSearch()}
        class="sm:hidden text-xs font-bold uppercase tracking-widest text-muted-foreground"
      >
        Cancel
      </button>
    </div>

    <div
      bind:this={resultsList}
      class="max-h-[60vh] sm:max-h-[400px] 3xl:max-h-[600px] overflow-y-auto p-2 sm:p-4"
    >
      {#if query.length === 0}
        <div class="p-12 text-center">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Start typing to search...
          </p>
        </div>
      {:else if loading && results.length === 0}
        <div class="p-12 text-center">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Searching...
          </p>
        </div>
      {:else if !loading && results.length === 0 && query.length > 0}
        <div class="p-12 text-center">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            No results found for "{query}"
          </p>
        </div>
      {:else}
        <div class="space-y-1">
          {#each results as result, i (result.url)}
            <a
              href={result.url}
              data-index={i}
              class="block p-4 sm:p-5 rounded-xl transition-all no-underline group {i ===
              selectedIndex
                ? 'bg-accent'
                : 'hover:bg-accent'}"
              onclick={() => uiState.closeSearch()}
            >
              <h3
                class="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors mb-1"
              >
                {result.meta?.title || 'Untitled'}
              </h3>
              {#if result.excerpt}
                <p
                  class="text-xs sm:text-sm text-muted-foreground line-clamp-2 opacity-80 [&>mark]:bg-primary/20 [&>mark]:text-foreground [&>mark]:rounded [&>mark]:px-0.5"
                >
                  {@html result.excerpt}
                </p>
              {/if}
            </a>
          {/each}
        </div>
      {/if}
    </div>

    <div
      class="hidden sm:flex items-center justify-between px-6 py-3 border-t border-border bg-secondary/30"
    >
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
          <kbd
            class="px-1.5 py-0.5 text-xs font-bold bg-background border border-border rounded shadow-sm"
            >⏎</kbd
          >
          <span class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >to select</span
          >
        </div>
        <div class="flex items-center gap-2">
          <kbd
            class="px-1.5 py-0.5 text-xs font-bold bg-background border border-border rounded shadow-sm"
            >↑↓</kbd
          >
          <span class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >to navigate</span
          >
        </div>
      </div>
      <div class="flex items-center gap-2">
        <kbd
          class="px-1.5 py-0.5 text-xs font-bold bg-background border border-border rounded shadow-sm"
          >esc</kbd
        >
        <span class="text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >to close</span
        >
      </div>
    </div>
  </div>
</div>
