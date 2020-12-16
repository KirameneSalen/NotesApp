import { useState } from 'react';

interface MyLocation {
    lat: number,
    lng: number,
    error?: Error;
}

export const useMyLocation = () => {
    const [state, setState] = useState<MyLocation>({lat: 0, lng: 0});
    function updateMyPosition(source: string, lat: number, lng: number, error: any = undefined) {
        console.log(source, lat, lng, error);
        setState({ ...state, lat: lat || state.lat, lng: lng || state.lng, error });
    }
    return {myLocation: state, updateMyPosition};
};