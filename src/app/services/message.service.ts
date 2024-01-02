import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class MessageService {
    private messageSubject = new BehaviorSubject<string | null>(null);
    public message$ = this.messageSubject.asObservable();

    sendMessage(message: string) {
        this.messageSubject.next(message);
    }

    clearMessage() {
        this.messageSubject.next(null);
    }

    getMessage() {
        return this.messageSubject.asObservable();
    }

    setMessage(message:string | null): void {
        this.messageSubject.next(message);
    }
}