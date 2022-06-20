
export const stylesheet = `
<style scoped>
    table {
        margin-left: auto;
        margin-right:auto;
        font-size:larger;
    }

    td, th {
        vertical-align: top;
        padding: 1em;
    }

    
    .day-label, .game-count {
        margin-left:auto;
        margin-right:auto;
        text-align: center;
    }

    .higlighted-cell {
        background-color: lightgray;        
        color:white;
    }

    .tournament-cell {
        background-color: #0D0961;        
        color: yellow;
    }    

    .point-left, .point-right {
        background-color: #0D0961;
        border: 1px solid #0D0961;
        border-radius: 5%;
        color:white;        
        cursor:pointer;
    }

    .month-selector {
        font-size:larger;
    }

    .month-selector-cell {
        padding:0;
    }
</style>
`;