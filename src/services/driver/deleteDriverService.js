import { database } from "../../database/database.js";

export const deleteDriverService = async (data) => {
    try{
        const queryResponse = database.query("UPDATE drivers SET deleted = true WHERE cnh = $1;", [data]);
        return queryResponse;
    }
    catch (error){
        throw error;
    }

}