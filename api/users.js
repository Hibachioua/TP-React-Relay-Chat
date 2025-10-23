import { sql } from "@vercel/postgres";
import { checkSession, unauthorizedResponse, getConnecterUser } from "../lib/session";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const connectedUser = await getConnecterUser(request);

        if (!connectedUser) {
            return unauthorizedResponse();
        }

        const { rowCount, rows } = await sql`
            SELECT 
                user_id, 
                username, 
                TO_CHAR(last_login, 'DD/MM/YYYY HH24:MI') AS last_login 
            FROM users 
            WHERE user_id != ${connectedUser.id}
            ORDER BY last_login DESC NULLS LAST
        `;

        console.log(`Got ${rowCount} users (excluding current user)`);
        
        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: {'content-type': 'application/json'},
        });
    } catch (error) {
        console.error("Error in users endpoint:", error);
        return new Response(JSON.stringify({
            message: error.message,
            details: error
        }), {
            status: 500,
            headers: {'content-type': 'application/json'},
        });
    }
};