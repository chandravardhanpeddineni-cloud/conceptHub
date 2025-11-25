import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useAuth } from ".";
import { useNavigate } from "react-router-dom";
const articleCreate = async (values) => {
  try {
    const response = await axios.post(
      "https://backend-blog-28ea.onrender.com/api/articles/add",
      { data: values }
    );
    return response;
  } catch (err) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { status, data } = err.response;
    if (status === 401) {
      alert("Session Expired please Relogin");
      logout();
      navigate("/");
    } else {
      console.log(err);
    }
  }
};
const useCreateArticle = () => {
    const queryClient=useQueryClient();
    const navigate=useNavigate();
  const { mutate: createArticle,isLoading:isCreating } = useMutation({
    mutationFn: articleCreate,
    onSuccess: ()=>{
        alert("New post successfully created");
        queryClient.invalidateQueries({queryKey:['getPosts']});
        navigate('/');
    },
    onError: (err)=> alert(err.message),
  });
  return {
    createArticle,
    isCreating
  };
};

export default useCreateArticle;
