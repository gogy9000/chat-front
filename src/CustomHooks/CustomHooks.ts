import { useEffect } from "react";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppDispatchType, AppRootStateType} from "../Store/Store";



export const useDispatchApp: () => AppDispatchType = useDispatch

export const useSelectorApp: TypedUseSelectorHook<AppRootStateType> = useSelector

export const useDebouncedEffect = (effect:Function, deps:any, delay:number) => {
    useEffect(() => {
        const handler = setTimeout(() => effect(), delay);

        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps || [], delay]);
}