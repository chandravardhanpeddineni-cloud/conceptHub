import { useEffect, useState,useRef } from "react";
// import { useUserQuery } from "../hooks";
import axios from "axios";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import useStore from "../hooks/useStore";
import SkeletonPost from "../components/SkeletonPost";


const Home = () => {
  const { isAuth, authUser, filteredPostsData } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const page=useStore((state)=>state.page);
  const setPage=useStore((state)=>state.setPage);
  const navigate = useNavigate();
  const [hasMore,setHasMore]=useState(true);
  const [loading,setLoading]=useState(false);
  const observer=useRef();
  // use a callback ref for the last post to avoid recreating the IntersectionObserver
  const lastPostRef = useRef(null);
  const resetPosts = useStore((state) => state.resetPosts);
  // console.log(isAuth);
  // const ArticlesData = useArticlesQuery();
  // const obj=snapshot(proxy(filteredPostsData));
  // console.log(obj);
  // console.log([...ArticlesData])
  // const Articles = ArticlesData?.data?.data;
  // console.log(Articles);

  const filteredPosts = useStore((state) => state.filteredPosts);
  const suggestions = useStore((state) => state.suggestions);

  const setSearchKeyword = useStore((state) => state.setSearchKeyword);

  console.log(filteredPosts)
  const [expandedArticle, setExpandedArticle] = useState(null);

  const posts=useStore((state)=>state.posts);
  console.log(posts)
  const setPosts=useStore((state)=>state.setPosts);
  const getPostsData=async(controller)=>{
      if(loading || !hasMore){
        return ;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `https://backend-blog-28ea.onrender.com/api/articles/posts?page=${page}&limit=5`,
          controller ? { signal: controller.signal } : undefined
        );
        const newPosts=response?.data?.posts || [];
        const fullData=[...posts,...newPosts];
        setHasMore(response?.data?.hasMore);
        if(posts.length!==fullData.length){
          setPosts(fullData);
        }
      } catch (err) {
        if (axios.isCancel && axios.isCancel(err)) {
          // request was cancelled
        } else {
          console.log(err);
        }
        return err;
      } finally {
        setLoading(false);
      }
  }
  // console.log(Articles);

  const fetchFollowersAndFollowing = async () => {
    const followers = await axios.get('https://backend-blog-28ea.onrender.com/api/users/followers');
    // console.log(followers);
    const following = await axios.get('https://backend-blog-28ea.onrender.com/api/users/following');
    // console.log(following);
    setFollowing(following?.data);
  }
  // Use a stable callback ref to observe the last post element for infinite scroll.
  useEffect(() => {
    const options = { threshold: 0.1 };
    const obsCallback = (entries) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting && !loading && hasMore) {
        // increment page (read current page and add 1)
        setPage(page + 1);
      }
    };

    observer.current = new IntersectionObserver(obsCallback, options);
    const currentObserver = observer.current;

    if (lastPostRef.current) {
      currentObserver.observe(lastPostRef.current);
    }

    return () => {
      if (currentObserver && lastPostRef.current) {
        currentObserver.unobserve(lastPostRef.current);
      }
      currentObserver && currentObserver.disconnect();
    };
    // Intentionally only re-run when `page`, `loading`, or `hasMore` change to avoid
    // recreating the observer on every posts update which can cause jitter/delays.
  }, [page, loading, hasMore]);
  useEffect(() => {
    if (isAuth) {
      // console.log(authUser);
      fetchFollowersAndFollowing()
    }
    else{
      setFollowing([]);
    }
  }, [isAuth]);
  useEffect(()=>{
    const controller = new AbortController();
    getPostsData(controller);
    return ()=>{
      controller.abort();
    }
  },[page]);
  
  const formatDate = (createdAt) => {

    const created = new Date(createdAt);

    const now = new Date();

    const time = now - created;
    const secs = Math.floor(time / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years >= 1) {
      return `${years} year`;
    }
    if (months >= 1) {
      return `${months} mon`;
    }
    if (days >= 1) {
      return `${days} day`;
    }
    if (hours >= 1) {
      return `${hours} hour`;
    }
    if (mins >= 1) {
      return `${months} min`;
    }
    return `${secs} sec`;
  }
  const handleDelete = async (item) => {
    const response = await axios.post(
      "https://backend-blog-28ea.onrender.com/api/articles/deletepost",
      { data: item }
    );
    // console.log(response);
  };
  const handleFollow = async (item) => {
    if (!isAuth) {
      navigate('/login')
      return;
    }
    console.log(item.author._id);
    console.log(following);
    const response = await axios.post('https://backend-blog-28ea.onrender.com/api/users/follow', { to_follow_id: item?.author?._id });
    // console.log(response);
    const updatedFollowing = [...following, { following_id: item.author._id }];
    console.log(updatedFollowing)
    setFollowing(updatedFollowing);
    // setUpdated(!updated);
  }
  const handleUnFollow = async (item) => {
    if (!isAuth) {
      navigate('/login')
      return;
    }
    // console.log(item.author._id);
    console.log(following)
    const response = await axios.post('https://backend-blog-28ea.onrender.com/api/users/unfollow', { following_id: item.author._id });
    const updatedFollowing = following?.filter((id) => id?.following_id !== item?.author?._id);
    console.log(updatedFollowing)
    setFollowing(updatedFollowing);
    // console.log(response);
    // setUpdated(!updated);
  }
  const handleSuggestion = (item) => {
    setSearchKeyword(item?.title);
  }
  
  // useEffect(()=>{
  // })NewPostsDataIncluded
  return (
    <div className="min-h-screen">
      <section className="max-w-4xl mx-auto px-6">
        <h2 className="sm:text-xl md:text-2xl font-semibold text-green-600 mb-6">📚 Your Feed</h2>
        <div className="space-y-8">
          {posts.length === 0 && loading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonPost key={i} />
              ))}
            </div>
          ) : (
            Array.isArray(filteredPosts) && filteredPosts?.map((item, index) => (
              <div
                key={item._id}
                ref={index===filteredPosts?.length-1 ? lastPostRef : null}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg"
              >
                <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                  <div className="flex items-center">
                    <img
                      src="https://ui-avatars.com/api/?name=Author&background=green&color=fff"
                      alt="Author"
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <Link to={`/user/${item?.author?._id}`}><p className="font-bold text-2xl">{item?.author?.name}</p></Link>
                      <p>Ex Software Developer @Auro.Edu</p>
                      <p>{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                  {
                    following?.some((cur) => cur?.following_id === item?.author?._id) ? (<p><button className="hover:bg-green-200 p-1.5 hover:rounded-sm" onClick={() => handleUnFollow(item)}>Following</button></p>) : (<p><button className="hover:bg-green-200 p-1.5 hover:rounded-sm" onClick={() => handleFollow(item)}>Follow</button></p>)
                  }
                </div>

                <Link
                  to={`/article/${item.slug}`}
                  state={{ item }}
                  className="hover:underline"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-gray-600 mt-2 line-clamp-2">{item.body}</p>
                <div className="flex gap-3 pt-3">
                  <p>{item?.likes?.length} Likes</p>
                  <p>{item?.comments?.length} Comments</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
