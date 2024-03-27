import { useSelector } from "react-redux";

export const useStoreState = (name) => useSelector((state) => state[name]);
