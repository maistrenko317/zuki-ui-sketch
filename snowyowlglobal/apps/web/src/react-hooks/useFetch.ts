import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Response } from './types';

export const useFetch = <T,> (url: string, headers?: Record<string, any>) => {
    const [response, setResponse] = useState<T | null>(null);
    const [error, setError] = useState<any>(null);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      (async () => {
        try {
          const response = await axios.get<Response<T>>(url, {headers: headers || {}});
          const entity = response.data.entity;
          setResponse(entity);
        }catch(error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      })();      
    }, []);
    return { response, error, isLoading };        
}