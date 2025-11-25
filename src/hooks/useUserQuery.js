import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import useAuth from './useAuth';
const getCurrentUser = async () => {
  try {
    const response = await axios.get("https://backend-blog-28ea.onrender.com/api/users/user");
    const { data } = response;
    // console.log("user Data extracted through tanQuery", data);
    return data;
  } catch (err) {
      console.log(err);
      return err;
  }
};
const useUserQuery = () => {
  
  const {
    data: userData,
    isLoading: isUserDataLoading,
    
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
  });
  // const =userData;
  const status=userData?.status;
  // console.log(status);
  if(status && status==401){
      const {logout}=useAuth();
      logout();
  }
  // console.log("err in user authentication ",userData);
  return { userData, isUserDataLoading };
};

export default useUserQuery;
