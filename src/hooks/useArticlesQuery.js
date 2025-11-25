import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
// console.log(useAuth);
import useStore from "./useStore";
async function getPostsData() {
  try {
    const response = await axios.get(
      "https://backend-blog-28ea.onrender.com/api/articles/posts",{
        params:{
          page:2,
          limit:5,
        }
      }
    );
    console.log(response);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}
const useArticlesQuery = () => {
  const setPosts=useStore((state)=>state.setPosts);
  const { data } = useQuery({
    queryKey: ["getPosts"],
    queryFn: () => getPostsData(),
    staleTime: 100000,
    cacheTime: 100000,
  });
  console.log("refetched");
  // console.log(data);

  const navigate=useNavigate();
  const status=data?.status;
  if(status==401){
      navigate('/register');
      return ;
      // alert("Authenticate to see Posts");
  }
  console.log(data?.data);
  setPosts(data?.data);
  return {
    data,
  };
};

export default useArticlesQuery;