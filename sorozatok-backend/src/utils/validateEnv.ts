import { cleanEnv, port, str } from "envalid";

export default function validateEnv(): void {
    cleanEnv(process.env, {
        JWT_SECRET: str(),
        MONGO_URI: str(),
        PORT: port(),
    });
}
