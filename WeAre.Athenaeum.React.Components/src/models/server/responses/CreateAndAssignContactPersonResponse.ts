import User from "@/models/server/User";

export default class CreateAndAssignContactPersonResponse {
    public user: User | null = null;

    public successfully: boolean = false;
}