import { autoserialize } from "cerialize";
import { CSSProperties } from "react";

const common: CSSProperties = {
    padding: "15px",
    textAlign: "center"
}

export const styles: Record<string, CSSProperties> = {
    transactionDate: {
        fontSize: "small",
    },

    affiliateTree: {
        display: "block",
        width: "60%",
        marginLeft: "auto",
        marginRight: "auto"        
    },
    
    child :{
        borderTop: "2px solid #ccc",
        display: "block",
    },

    transaction :{
        borderTop: "2px solid #ccc",
        display: "block",
        padding: "1rem",
        marginBottom: "1rem"
    },

    childParagraph: {
        marginTop: "0.5em",
        marginBottom: "0.5em",
    },

    details: {
        display: "block",
        width: "100%",
        padding:0
    },

    detailText: {
        fontWeight: "bold",
        display: "inline"
    }, 

    detailLabel: {
        display: "inline"
    }, 

    header : {        
        background: "#0C325F",
        color: "#fCfCfC",
        fontSize: "15px",
        display: "grid",    
        gridTemplateColumns: "repeat(2, 1fr)",
        padding: 0
    },

    headerTop: {
        ...common,
        gridColumn: "1 / span 2", 
        gridRow: 1     ,
        borderTop: "1px solid white",
        borderLeft: "1px solid white",
        borderRight: "1px solid white",
    },

    headerBottomLeft: {
        ...common,
        gridColumn: 1, 
        gridRow: 2,
        border: "1px solid white",
    },

    headerBottomRight: {
        ...common,
        gridColumn: 2, 
        gridRow: 2,
        border: "1px solid white",
    }, 
    headerDataText: {
        display: "block"
    },
    headerDataLabel: {
        display: "block",
        fontWeight: "bold",
        cursor: "pointer"
    },    
}
