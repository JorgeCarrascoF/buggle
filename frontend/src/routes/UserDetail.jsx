import { useParams } from "react-router-dom";
import UserInfo from "../components/UserInfo";

const UserDetails = () => {
  const { id } = useParams();

  return (
    <div className="w-full h-full">
      <UserInfo userId={id} />
    </div>
  );
};

export default UserDetails;
