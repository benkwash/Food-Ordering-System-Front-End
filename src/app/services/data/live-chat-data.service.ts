import { Injectable } from '@angular/core';

@Injectable()
export class LiveChatDataService {

    private chatID=null; //contains chat id from chat db

    private messages:Array<{from:String,message:String,date:String}>=[]; //contains all messages from current session
    //{date//sender//message}

    //holds new message to be sent
    private messsage="";

    //holds the session type..
    private sessionType:"";

    //retrieve chat id
    public getChatID(){
        return this.chatID;
    }

    //set chat id
    public setChatID(ID){
        this.chatID=ID;
    }

    //return messages
    public getMessages(){
        return this.messages;
    }

    //push new message into messages array
    public updateMessages(message){
        this.messages.push(message)
    }

    //new ..push array of messages
    public pushManyMessages(messages){
        for(let i of messages){
            this.updateMessages(i)
        }
    }

    //set message
    public setMessage(message){
        this.messsage=message;
    }

    //retrieve message
    public getMessage(){
        return this.messsage;
    }

    //return session type
    public getSessionType(){
        return this.sessionType;
    }

    //set sessionType
    public setSessionType(sessionType){
        this.sessionType=sessionType;
    }
    

    //reset.....end of session
    public resetData(){
        this.chatID=null;
        this.messages=null;
        this.messsage=null;
    }
    
}