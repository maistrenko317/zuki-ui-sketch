const exec = require("child_process");
const fs = require("fs");
const outputFile = "output/users-and-roles.csv";
const emailToRoleCSVFile = "output/email-to-role-pivot.csv";
const command = `./mysql-query.sh sql/users-and-roles.sql > ${outputFile}`;

exec.execSync(command);
const lines = fs.readFileSync(outputFile)
    .toString()
    .split(/[\n\r]/)
    .filter(line => line.length > 0)    
    .map(line => line.replace(/"/g, "").split(","))
    .slice(1);
    
const roles = [...lines.reduce(
    (result, line) => {
        result.add(line[1])
        return result;
    },
    new Set()
)];

const emails = [...lines.reduce(
    (result, line) => {
        result.add(line[0])
        return result;
    },
    new Set()
)]; 

const eMailToRolePivotData = emails.map(email => {
    const result = roles.reduce(
        (array, role) => {
            const hasRole = lines.some(line => line[1] === role && line[0] === email);
            return ([...array, hasRole ? '✓' : '']);
        },
        [email]
    );

    return result
});

const eMailToRolePivotCSV = [...[['email',...roles]],...eMailToRolePivotData];
fs.writeFileSync(emailToRoleCSVFile, eMailToRolePivotCSV.map(row => row.join(',')).join("\n"));