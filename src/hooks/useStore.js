import { create } from 'zustand';
const useStore = create((set) => ({
    posts: [],
    filteredPosts: [],
    suggestions: ["first", "second"],
    searchKeyword: "",
    page:1,
    setSearchKeyword: (str) => set({ searchKeyword: str }),
    setSuggestions: (bufferSuggestions) => set({
        suggestions: bufferSuggestions
    }),
    setPosts: (bufferPosts) => set({
        posts: bufferPosts,
        filteredPosts: bufferPosts
    }),
    setFilterPosts: (bufferPosts) => set({
        filteredPosts: bufferPosts
    }),
    setPage: (page)=>set({page:page}),
    resetPosts: () => set({ posts: [] }),
}));

export default useStore;