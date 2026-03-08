import { error } from "console";
import { failure, Result, success } from "../entity/result";


export function handleNewConnection(userId: string): Result<
    { type: "opponent_found", match_id: string },
    "user_already_connected" | "generic_error"> {
    const result = success()
    return failure("generic_error")
}