import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks";
import { Link, useParams } from "react-router-dom";

const UserProfile = () => {
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  
//   const { authUser } = useAuth();
  const params=useParams();
  const fetchFollowersAndFollowing = async () => {
    try {
      const userData=await axios.get(`https://backend-blog-28ea.onrender.com/api/user/${params.id}`);
      console.log(userData?.data);
      setUserInfo(userData?.data);
    } catch (err) {
      console.log("Error fetching followers/following", err);
    }
  };

  useEffect(() => {
    fetchFollowersAndFollowing();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <img
            src={`https://ui-avatars.com/api/?name=${
              userInfo?.name || "User"
            }&background=0D8ABC&color=fff`}
            alt="profile_pic"
            className="w-16 h-16 rounded-full border-2 border-blue-400 shadow-sm"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {userInfo?.name || "Unknown User"}
            </h2>
            <p className="text-sm text-gray-500">
              I do whatever I feel to do ✨
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-around mt-6 text-center">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {userInfo?.followers}
            </p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">
              {userInfo?.following}
            </p>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex justify-around mt-6 text-center">
          <button className="cursor-pointer">Follow</button>
          <Link to={`/chat/${params?.id}`}><p className="cursor-pointer">Message</p></Link>
        </div>
        

        {/* Bio */}
        {/* <div className="text-center">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 shadow-sm">
            Edit Profile
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default UserProfile;
