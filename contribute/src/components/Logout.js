import { useDispatch } from 'react-redux';

const Logout = () => {

    const dispatch = useDispatch();
    dispatch({ type: 'AUTH.LOGOUT' });

    return null;

}

export default Logout;