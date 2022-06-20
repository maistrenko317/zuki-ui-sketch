export const stylesheet = `
<style scoped>
  .referrer-profile {
      padding:0;
      margin:0;
  }

  .header-text {
      font-size: 16px;
      padding-left: 7px;
  }    
  
  header {
      width:100%;    
      text-align:left;    
  }

  .link {
      color: #093061;
      text-decoration: underline;
      cursor: pointer;
  }

  .info{
      color: #093061;
      margin-left: 0.5em;
      font-size: 1.25em;    
  }

  .amounts {
      display: flex;
      align-items: stretch;
      justify-content: stretch;
    }
  
  .amount {
    text-align: center;
    display: table;
    text-align: center;
    flex: 1;
    padding: 8px;
    font-size: 14px;
  }

  .amount div {
    font-weight: bold;
    margin-bottom: 3px;
    display:table-cell;
    vertical-align: bottom;
  }

  .amount span.label {
    display:block;
  }

  .amount span.fact {
    font-weight: normal;
  }      

  .header-text {
    font-size: 16px;
    padding-left: 7px;
    flex: 1;
  }
  
  .title {
    font-weight: bold;
    flex: none;
    font-size: 18px;
    text-align: center;
    display: inline-block;  
  }
  .avatar {
    width: 7em;
  }
  
  .title p {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }      

  .earnings-column {
    text-align: right;
    vertical-align:top;
  }

  span.earnings-label {
    display:block;
  }

  .no-border {
    border-collapse:collapse;
  }
</style>
`;