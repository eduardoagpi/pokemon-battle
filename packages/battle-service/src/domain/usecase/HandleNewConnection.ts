import { Result, success } from "../entity/result";

export function handleNewConnection(userId: string): Result<void, "user_already_connected" | "generic_error"> {
    const result = success()
    return success()
}