import axios from "axios";
import { useEffect, useState } from "react";

export const useFetch = <T,>(url: string, headers: Record<string, string>, initial?: T) =>{
    const [response, setResponse] = useState<T>((initial || {}) as T);
    const [serverError, setServerError] = useState<any>(false);
        
    useEffect(()=>{
        (async () => {
          try {
            const resp = await axios.get(url, {headers: headers});
            const data = resp.data.entity as T;
            
            setResponse(data);
          } catch (error) {
            setServerError(error);
          }
        })();
    

    },[url])
 
    return { response, serverError };
 }

export const formatToCurrency = (amount?:number) => {
  if(typeof amount === "undefined") {
    return "0.00";
  }
  return amount!.toFixed(2);
};

