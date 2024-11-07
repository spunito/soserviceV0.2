import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

// Define the ChatMessage interface to structure our messages
interface ChatMessage {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

// Define the Contact interface to structure our contacts
interface Contact {
  creadorId: string;
  messages: ChatMessage[];
  otherUserId: string;
  lastMessage: ChatMessage | null;
  otherUserName: string;
}

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.page.html',
  styleUrls: ['./contactos.page.scss'],
})
export class ContactosPage implements OnInit {
  currentUserId: string | null = null;
  contactos: Contact[] = [];

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCurrentUser();
  }

  // Obtener el usuario actual
  getCurrentUser() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadContactos();
      }
    });
  }

  // Cargar contactos desde Firebase
// En la función loadContactos()
loadContactos() {
  this.db.list('chats').snapshotChanges().subscribe((chats: any[]) => {
    this.contactos = [];

    chats.forEach(chatSnapshot => {
      const chatId = chatSnapshot.key;
      const chatData = chatSnapshot.payload.val();

      if (chatData && chatData.messages) {
        const messagesArray: ChatMessage[] = [];

        Object.keys(chatData.messages).forEach(msgKey => {
          const msg = chatData.messages[msgKey];
          if (msg && typeof msg === 'object' && 'senderId' in msg && 'receiverId' in msg && 'text' in msg && 'timestamp' in msg) {
            messagesArray.push(msg as ChatMessage);
          }
        });

        const userMessages = messagesArray.filter(msg =>
          msg.senderId === this.currentUserId || msg.receiverId === this.currentUserId
        );

        if (userMessages.length > 0) {
          const otherUserId = userMessages[0].senderId === this.currentUserId
            ? userMessages[0].receiverId
            : userMessages[0].senderId;

          // Cargar el nombre del otro usuario
          this.db.object(`users/${otherUserId}`).valueChanges().subscribe((user: any) => {
            this.contactos.push({
              creadorId: chatId,
              messages: userMessages,
              otherUserId: otherUserId,
              lastMessage: userMessages[userMessages.length - 1] || null,
              otherUserName: user?.name || 'Usuario' // Agregar nombre
            });
          });
        }
      }
    });
  });
}

  // Navegar al chat
  goToChat(otherUserId: string) {
    const chatId = this.createChatId(this.currentUserId, otherUserId);
    this.router.navigate(['/chat'], {
      queryParams: {
        usuarioId: this.currentUserId,
        creadorId: otherUserId,
        chatId: chatId
      }
    });
  }

  createChatId(userId1: string, userId2: string): string {
    return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
  }
}
