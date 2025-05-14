import MeProfileDetails from "@/components/MeProfileDetails";
import { useCurrentUser } from "@/hooks/useCurrentUser";


const MeProfile = () => {

    const { data: user } = useCurrentUser();
    
  return (
    <div className="w-screen h-screen p-10">
        {user && <MeProfileDetails user={user} />}

    </div>
  );
}
export default MeProfile;