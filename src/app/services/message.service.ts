import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { UserModel } from "../models/user-model";

@Injectable({
    providedIn: 'root',
})

export class MessageService {
    private messageSubject = new BehaviorSubject<string | null>(null);
    private messageSubjectUser = new BehaviorSubject<UserModel | null>(null);
    public message$ = this.messageSubject.asObservable();

    sendMessage(message: string) {
        this.messageSubject.next(message);
    }

    sendUserDetails(user: UserModel) {
        this.messageSubjectUser.next(user);
    }

    clearMessage() {
        this.messageSubject.next(null);
    }

    clearUserDetails() {
        this.messageSubjectUser.next(null);
    }

    getMessage() {
        return this.messageSubject.asObservable();
    }

    getUserDetails() {
        return this.messageSubjectUser.asObservable();
    }

    setMessage(message: string | null): void {
        this.messageSubject.next(message);
    }

    setUserDetails(object: UserModel | null): void {
        this.messageSubjectUser.next(object);
    }
}