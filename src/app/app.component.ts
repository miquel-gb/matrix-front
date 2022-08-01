import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5UZzBPREJGTVRSQ1JURXdOVFEyUkRBek9UbEJRemN4TkVZMU5EUkRPVVJCTVVNMlJqZzVPQSJ9.eyJodHRwczovL3RyYXZlbGdhdGV4LmNvbS9pYW0iOlt7ImEiOm51bGwsImMiOiJ4dGciLCJnIjpbeyJhIjpudWxsLCJjIjoicGxhdGZvcm0iLCJnIjpbeyJhIjp7ImFsbCI6eyJhbGwiOnsiYWxsIjpbImNydWQxeGEiXX0sInNwZWVkIjp7ImFsbCI6WyIxYSJdfX0sImplZGkiOnsiYWxsIjp7ImFsbCI6WyJyMSJdfX19LCJjIjoiZnJvbnQiLCJnIjpudWxsLCJwIjp7ImlhbSI6eyJncnAiOlsicjEiXSwibWJyIjpbInIxIl19fSwidCI6IlRFQU0ifV0sInAiOm51bGwsInQiOiJURUFNIn0seyJhIjpudWxsLCJjIjoicHJvZHVjdHMiLCJnIjpbeyJhIjpudWxsLCJjIjoiZGlzdHJpYnV0aW9ueCIsImciOlt7ImEiOm51bGwsImMiOiJkaXN0cmlidXRpb254LXZpZXdlcnMiLCJnIjpudWxsLCJwIjp7ImRpc2JhdCI6eyJoYnQiOlsiY3J1ZDEiXX0sImRpc3dlYiI6eyJod2IiOlsiY3J1ZDEiXX19LCJ0IjoiVEVBTSJ9XSwicCI6bnVsbCwidCI6IlRFQU0ifV0sInAiOm51bGwsInQiOiJURUFNIn0seyJhIjp7ImFsbCI6eyJhbGwiOnsiYWxsIjpbImNydWQxeGEiXX19fSwiYyI6InN0YWZmIiwiZyI6bnVsbCwicCI6eyJpYW0iOnsiZ3JwIjpbInIxIl0sIm1iciI6WyJyMSJdfX0sInQiOiJURUFNIn1dLCJwIjpudWxsLCJ0IjoiUk9PVCJ9XSwiaHR0cHM6Ly90cmF2ZWxnYXRleC5jb20vbWVtYmVyX2lkIjoibWlxdWVsLmdpbmVzQHRyYXZlbGdhdGUuY29tIiwiaHR0cHM6Ly94dGcuY29tL2dyb3VwcyI6W10sImh0dHBzOi8veHRnLmNvbS9yb2xlcyI6W10sImh0dHBzOi8veHRnLmNvbS9wZXJtaXNzaW9ucyI6W10sIm5pY2tuYW1lIjoibWdpbmVzIiwibmFtZSI6Im1pcXVlbC5naW5lc0B0cmF2ZWxnYXRlLmNvbSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci80YmE0OGUzMjEwNjA2MjcwY2Q4MDVjZjNjM2U0OTk5Yz9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRm1nLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIyLTA3LTI5VDA3OjMyOjE4Ljk5NVoiLCJlbWFpbCI6Im1pcXVlbC5naW5lc0B0cmF2ZWxnYXRlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL3h0Zy5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjExZDAwMTg1NzBhMjcwMDcwODBmMGE3IiwiYXVkIjoiejViczdZbzVMNXRaMThoVTdhSHNreVF1N251dHlhZ08iLCJpYXQiOjE2NTkwNzk5NDEsImV4cCI6MTY1OTExNTk0MSwiYXRfaGFzaCI6IjAtQ1g2Zmh3c0t6SV9lTjBzMGhGVGciLCJub25jZSI6Ik5HaDJmM1UxWmtqbjZEZ3o1TTE3ZjJ5MEdNdUp0SkdsIn0.pCrUJGFmRvO5j3EOSjTMbqxptX09LTlhr7YDTSRfGtBboKgCn5m6M0a0vjFqG-wbv6PsYaL1Qvg2gKKzDXq-9Powg7t5yy5zKEOonSvqIagdo-Y31d_BQHKpdiVq_nGbqYrjtGbnYSi79HEepgIflE6IwThSo7QBJWBnAiDufcDV5EpkCtvMErawl20hIF59xeCMfic4Vq81b4b9Yf4cvyt6yeDWVglGRs2Ny64mh8azqxufSppWvA38AzxJntcbqp73WsY7KvU9WtAD0Nph1wznH1mZaIcRLoARspgyJET0oVWPQSTJ3izgEDFGHRQrbk4DZP6n4i2x3Mcgf20F2g'
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'Bearer ' + accessToken);
    this.http.get<LoginResponse>('http://localhost:3000/getAccessToken', { headers: headers}).subscribe(
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