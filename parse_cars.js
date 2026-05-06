const fs = require('fs');

function parseFH4() {
    const csvContent = fs.readFileSync('.examples/Forza Horiozn 4 Car List/vehicles.csv', 'utf-8');
    const lines = csvContent.split('\n');
    const db = {};
    
    // skip header (first line)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Handle quotes in CSV if any, but looking at the snippet, it's mostly clean comma-separated
        const parts = line.split(',');
        if (parts.length >= 4) {
            const name = parts[1].trim();
            const id = parts[2].trim();
            const manufacturer = parts[3].trim();
            
            if (id && !isNaN(id)) {
                // To match "Abarth 1980 Fiat 131" or just use the name if manufacturer is already in it
                // e.g. "2017 124 Spider" -> "Abarth 2017 124 Spider"
                let fullName = name;
                if (!name.toLowerCase().includes(manufacturer.toLowerCase())) {
                    fullName = `${manufacturer} ${name}`;
                }
                db[id] = fullName;
            }
        }
    }
    
    fs.writeFileSync('src-tauri/cars_fh4.json', JSON.stringify(db, null, 2));
    console.log(`Parsed FH4: ${Object.keys(db).length} cars.`);
    return db;
}

function parseFH5() {
    const htmlContent = fs.readFileSync('.examples/Forza Horizon 5 Car List.html', 'utf-8');
    const db = {};
    
    // Regular expression to find all <tr> blocks within <tbody>
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
    let match;
    
    while ((match = trRegex.exec(htmlContent)) !== null) {
        const trContent = match[1];
        
        // Extract all <td> contents
        const tdRegex = /<td[^>]*>(.*?)<\/td>/g;
        const tds = [];
        let tdMatch;
        while ((tdMatch = tdRegex.exec(trContent)) !== null) {
            // Remove any inner HTML tags (like <a>) just in case
            tds.push(tdMatch[1].replace(/<[^>]*>?/gm, '').trim());
        }
        
        if (tds.length >= 6) {
            const name = tds[0];
            const id = tds[5];
            
            if (id && !isNaN(id)) {
                db[id] = name;
            }
        }
    }
    
    fs.writeFileSync('src-tauri/cars_fh5.json', JSON.stringify(db, null, 2));
    console.log(`Parsed FH5: ${Object.keys(db).length} cars.`);
    return db;
}

const fh4Db = parseFH4();
const fh5Db = parseFH5();

// Combine both into one main cars.json for our app to use immediately
const combinedDb = { ...fh4Db, ...fh5Db };
fs.writeFileSync('src-tauri/cars.json', JSON.stringify(combinedDb, null, 2));
console.log(`Combined DB written to src-tauri/cars.json: ${Object.keys(combinedDb).length} cars.`);
