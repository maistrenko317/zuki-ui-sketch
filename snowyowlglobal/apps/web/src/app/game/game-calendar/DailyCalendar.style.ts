
export const stylesheet = `
<style scoped>
    table {
        margin-left: auto;
        margin-right:auto;
        font-size:larger;
    }

    .game-name, .game-name-h {
        text-align: left;
    }

    .game-name, span {
        display:block;
    }

    .game-name, .time {
        font-size:smaller;
    }    

    .game-award, .game-award-h {
        text-align: right;
        vertical-align: top;
    }    

    .game-photo img {
        width:100%;
    }

    .game-photo {
        padding:0;
    }

    .game-photo .container {
        padding: 0;
        margin: 0;
        text-align: center;   
        max-width: 24rem;
    }

    @media only screen and (max-width: 480px) {
        .game-photo .container {
            width: 10rem;
        }
    }

</style>
`;