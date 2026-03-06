export interface UserDTO {
    id: string;
    name: string;
    email: string;
}

export const logMessage = (msg: string) => {
    console.log(`[SHARED]: ${msg}`);
};
