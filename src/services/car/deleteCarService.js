import { database } from "../../database/database.js";

export const deleteCarService = async (data) => {
    try{
        const queryResponse = database.query("UPDATE cars SET deleted = true WHERE licenseplate = $1;", [data.toLowerCase()]);
        return queryResponse;
    }
    catch (error){
        throw error;
    }

}