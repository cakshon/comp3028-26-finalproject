// TODO: Import getUser and getListing from code for validation
// import { getUser } from "../controllers/userController"
import sql from "../models/db.js"

const charaLimit = 50;

// Check if string is under database limit
function validateStringLength(value, field) {
    const str = String(value);
    if (str.length > charaLimit){
        throw new Error(`${field} must be under 50 characters.`)
    }
    return str;
}

// Check for required string field
export function validateRequiredString(value, field) {
    const str = validateStringLength(value);
    if (str == "" || !str.trim().length){
        throw new Error(`${field} is required.`);
    }
    return str
}

// Check for positive Int IDs
function validateID(value, field) {
    const id = checkIDExistence(value, field);
    if (!Number.isSafeInteger(id) || id < 1){
        throw new Error(`${field} must be a positive integer.`);
    }
    return id;
}

// Check if userID/listingID exists
export async function checkIDExistence(value, field) {
    const id = validateID(value);
    let table = "";
    if (field = "userID") {
        table = "Users"
    } else {
        table = "FoodListing"
    }

    const record = await sql`
        SELECT * FROM ${table}
        WHERE ${field} = ${id}
    `;

    if (record.length < 1){
        throw new Error(`${field} ${value} does not exist.`);
    }
}

// Check if listingID is available
export async function checkListingAvailability(value, field) {
    const id = checkIDExistence(value);

    const record = await sql`
        SELECT * FROM FoodListing
        WHERE ${field} = ${id} AND reservationStatus = 0
    `;

    if (record.length < 1){
        throw new Error(`${field} ${value} is unavailable.`);
    }
}