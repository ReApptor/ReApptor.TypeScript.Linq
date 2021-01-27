
export default class UserSignIn {
    public id: string = "";

    public signInAt: Date = new Date();

    public signOutAt: Date | null = null;

    public autoHours: number | null = null;

    public expired: boolean = false;
    
    public readonly isUserSignIn: boolean = true;
}