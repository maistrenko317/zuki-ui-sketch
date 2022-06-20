
export const stylesheet = `
<style scoped>
.table-icon {
    font-size: large;
    color: #093061;
}

.tier-header {
    text-align: right;
}

.nickname-cell {
    text-align:left;
}

.number-cell {
    text-align: right;
}
table {
    border-collapse: collapse;
    border-spacing:0 5px;
    margin: 0;
    padding: 0;
    width: 100%;
    table-layout: fixed;
  }
  
  table caption {
    font-size: 1.5em;
    margin: .5em 0 .75em;
  }
  
  table tr {
    background-color: #fafafa;
    border: 1px solid white;
    padding-top: 0.17rem;
    padding-bottom: 0.17rem;
  }
  
  table tbody tr:hover {
    background-color: #7EA4D6;
    border-color: #7EA4D6;
    color:white;
    font-weight:bold;
    transition:.6s ease;
    opacith: 0.2;
  }

  table th,
  table td {
    padding: .625em;
    text-align: center;
  }
  
  table th {
    font-size: .85em;
    letter-spacing: .1em;
  }
  
  @media screen and (max-width: 600px) {
    table {
      border: 0;
    }
  
    table caption {
      font-size: 1.3em;
    }
    
    table thead {
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }
    
    table tr {
      border-bottom: 3px solid #ddd;
      display: block;
      margin-bottom: .15em;
    }
    
    table td {
      border-bottom: 1px solid #ddd;
      display: block;
      font-size: .8em;
      text-align: right;      
      word-wrap:break-word
    }
    
    table td::before {
      /*
      * aria-label has no advantage, it won't be read inside a table
      content: attr(aria-label);
      */
      content: attr(data-label);
      float: left;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    table td:last-child {
      border-bottom: 0;
    }
  }
     
  .referral-avatar {
    width: 5em;
    border-radius: 5%;
    border:1px solid transparent;
    margin:0;
  }

  .referral-nickname {
    margin: 0.25m;
  }  
</style>
`;