import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextApiRequest } from "next";
import { SessionPayload } from "@/types/globals";
import { NextRequest } from "next/server";
import { IUserData } from "@/components/interfaces/iuser";

const secretKey = process.env.SESSION_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(id: string, userData: IUserData){
    const sessionExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({id, userData, sessionExpiration});

    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: true,
        expires: sessionExpiration,
    });
}

export async function deleteSession(){
    (await cookies()).delete("session");
}

export async function encrypt(payload: SessionPayload){
    return new SignJWT(payload)
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = ""){
    try{
        const {payload} = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        });
        console.log("Server session is verified");
        return payload;
    } catch(error){
        console.log("Failed to verify session",error);
    }
}

export async function getSession(req: NextApiRequest) {
    try {
        const cookie = req.cookies.session;
        if (cookie) {
            return await decrypt(cookie);
        }
    } catch (error) {
        console.error("Error reading or decrypting session cookie:", error);
    }
}

export async function getSessionFromMiddleware(req: NextRequest): Promise<SessionPayload | null> {
    try {
        const cookie = req.cookies.get('session');
        
        if (cookie) {
            const decryptedSession = (await decrypt(cookie.value)) as SessionPayload;
            return decryptedSession;
        }
        return null; // Return null if no session cookie exists
    } catch (error) {
        console.error("Error fetching session:", error);
        return null; // Return null if any error occurs
    }
}