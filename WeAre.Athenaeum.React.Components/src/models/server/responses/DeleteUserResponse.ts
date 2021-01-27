import User from "../User";

export default class DeleteUserResponse {
    public user: User | null = null;

    public removedPermanently: boolean = false;
}