import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ForceChangePasswordForm } from '@/components/forceChangePassword';
import ROUTES from '@/constants/routes';

export function ForceChangePasswordPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [login, setLogin] = useState<string>('');

    useEffect(() => {

        const state = location.state as { login?: string } | null;

        if (!state || !state.login) {

            navigate(ROUTES.LOGIN);
            return;
        }

        setLogin(state.login);
    }, [location, navigate]);

    if (!login) {
        return null;
    }

    return (
        <div className="flex-grow flex justify-center items-center p-4">
            <div className="w-full max-w-md">
                <ForceChangePasswordForm login={login}/>
            </div>
        </div>
    );
}