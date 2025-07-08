import { useContext } from "react";
import { PriceStreamContext } from "../providers/PriceStreamProvider";

export const usePriceStream = () => useContext(PriceStreamContext);