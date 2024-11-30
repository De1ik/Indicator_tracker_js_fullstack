// parseCSV.js

const { addUser } = require("./db_setup.js");

const parseCSV = async (data) => {
    const lines = data.split('\n');

    if (lines.length === 0) {
        return { success: false, message: "CSV file is empty." };
    }
    
    const headers = lines[0].split(',').map(header => header.trim());

    const requiredHeaders = ['name', 'email', 'password', 'age'];
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

    if (missingHeaders.length > 0) {
        return { success: false, message: `Missing headers: ${missingHeaders.join(', ')}` };
    }

    let successCount = 0;
    let errors = [];

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        if (row.length === headers.length) {
            const user = {
                name: row[0].trim(),
                email: row[1].trim(),
                password: row[2].trim(),
                age: parseInt(row[3].trim()) || 18,
                height: 100
            };

            try {
                const result = await addUser(user, false);
            } catch (error) {
                console.error(`Error adding user at line ${i + 1}:`, error);
                errors.push(`Line ${i + 1}: ${error.message}`);
            }
        }
    }

    if (errors.length > 0) {
        return {
            success: false,
            message: `Imported ${successCount} users with ${errors.length} errors.`,
            errors
        };
    }

    return { success: true, message: `Successfully imported ${successCount} users.` };
}

module.exports = { parseCSV };
