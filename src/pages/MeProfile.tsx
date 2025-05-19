import MeProfileDetails from "@/components/MeProfileDetails";
import { useCurrentUser } from "@/hooks/useCurrentUser";


const MeProfile = () => {

    const { data: user } = useCurrentUser();
    
  return (
    <div className="flex-grow flex items-center justify-center">
        {user && <MeProfileDetails user={user} />}
    </div>
  );
}
export default MeProfile;