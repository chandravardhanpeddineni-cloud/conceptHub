import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useAuth } from ".";
import { useNavigate } from "react-router-dom";
const postArticleData = async (values) => {
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
      alert("Session Expired please ReLogin");
      logout();
      navigate("/");
    } else {
      console.log(err);
    }
  }
};
const useArticleQuery = (values) => {
  const { data: articleData } = useQuery({
    queryKey: ["CreatingArticle"],
    queryFn: () => postArticleData(values),
    enabled: values !== null,
  });
  // console.log("article data ", articleData);
  return {
    articleData,
  };
};

export default useArticleQuery;
