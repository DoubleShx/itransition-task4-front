export function recLookup(obj, path) {
    let parts = path.split(".");
    if (obj === null) {
        return obj
    }
    if (parts.length==1) {
        return obj[parts[0]];
    }
    
    return recLookup(obj[parts[0]], parts.slice(1).join("."));
}