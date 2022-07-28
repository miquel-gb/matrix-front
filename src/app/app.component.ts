import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'matrix-front';

  userId: string = '';
  accessToken: string = '';

  rooms: Room[] = [];
  messages: Message[] = [];

  sendText: any = '';

  matrixSdk = window['matrixcs' as any];

  client: any;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    // Wtf with this user / password
    this.http.post<LoginResponse>('http://localhost:3000/getLogin', { user: 'test', password: 'test' }).subscribe(
      (response: LoginResponse) => {
        this.userId = response['userId'];
        this.accessToken = response['accessToken'];
        this.createClient();
      }
    );
  }

  private createClient() {
    //@ts-ignore
    this.client = this.matrixSdk.createClient({
      baseUrl: 'http://localhost:8008',
      accessToken: this.accessToken,
      userId: this.userId
    });

    this.client.startClient();
    var that = this;
    this.client.once('sync', function (state: any, prevState: any, res: any) {
      console.log(state, prevState); // state will be 'PREPARED' when the client is ready to use

      that.printRooms();
      that.listenMessages();
    });

    // this.client.createRoom(
    //   {
    //     room_alias_name: 'testRoom2',
    //     visibility: 'public',
    //     invite: [this.userId]
    //   },
    //   (response: any) => {
    //   }
    // )

    // console.log(this.client.getRooms());
  }

  private printRooms() {
    const rooms = this.client.getRooms();
    this.rooms = rooms.map(
      (room: any) => {
        const r: Room = {
          id: room.roomId,
          name: room.name.split(':')[0].slice(1),

        }
        if (room.timeline.length) {
          r.messages = [];
          room.timeline.forEach(
            (evt: any) => {
              console.log(evt)
              if (evt.event.type === 'm.room.message') {
                r.messages?.push({
                  room: room?.name || 'Unknown room',
                  sender: evt.event.sender.split(':')[0].slice(1),
                  content: evt.event.content.body
                })
              }
            }
          );
        }
        if (r.messages?.length) this.messages = this.messages.concat(r.messages as Message[]);
        return r;
      }
    );

  }

  private listenMessages() {
    this.client.on('Room.timeline', (event: any) => {
      if (event.event.type === 'm.room.message') {
        const room = this.rooms.find((room: Room) => room.id === event.event.room_id);
        this.messages.push(
          {
            room: room?.name || 'Unknown room',
            sender: event.event.sender.split(':')[0].slice(1),
            content: event.event.content.body
          }
        );
      }
    }
    );
  }

  public send() {
    if (!this.sendText.length) return;
    this.client.sendTextMessage(this.rooms[0].id, this.sendText).then(
      () => {
        this.sendText = '';
      }
    );
  }

}

export interface LoginResponse {
  userId: string;
  accessToken: string
}

export interface Room {
  id: string;
  name: string;
  messages?: Message[];
}

export interface Message {
  room: string;
  sender: string;
  content: string;
}