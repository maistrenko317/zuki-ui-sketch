import React from "react";

export interface AffiliateTreeContextType {
    url: string[];
    rootUrl: string;
    setUrl: (url: string[]) => void;
}

export const AffiliateTreeContext = React.createContext<AffiliateTreeContextType | null>(null);