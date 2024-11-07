import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { NavController } from '@ionic/angular';


// Define la estructura del mensaje
interface ChatMessage {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  chatId: string | null = null;
  currentUserId: string | null = null;
  messages: ChatMessage[] = [];
  otherUserId: string | null = null; 
  otherUserName: string = '';
  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private navCtrl: NavController,

  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentUserId = params['usuarioId'];
      this.otherUserId = params['creadorId'];
  
      // Crear el chatId solo una vez
      this.chatId = this.createChatId(this.currentUserId!, this.otherUserId!);
      
      if (this.chatId) {
        this.loadMessages();
        this.loadOtherUserName(); // Cargar el nombre del otro usuario
      }
    });
  }
  
  // Función para crear el chatId
  createChatId(userId1: string, userId2: string): string {
    return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
  }
  
  loadMessages() {
    if (!this.chatId) {
      return;
    }
  
    this.db.list(`chats/${this.chatId}/messages`).valueChanges().subscribe((messages: any[]) => {
      this.messages = messages
        .filter(msg => typeof msg === 'object' && msg !== null)
        .map(msg => msg as ChatMessage);
  
      // Ordenar los mensajes por timestamp para mostrar en el orden correcto
      this.messages.sort((a, b) => a.timestamp - b.timestamp);
    });
  }

  loadOtherUserName() {
    if (!this.otherUserId) return; // Verifica que existe otro usuario

    this.db.object(`users/${this.otherUserId}`).valueChanges().subscribe((user: any) => {
      if (user) {
        this.otherUserName = user.name; // Asigna el nombre del otro usuario
      }
    });
  }

  sendMessage() {
    console.log("Datos antes de enviar el mensaje:", {
      chatId: this.chatId,
      newMessage: this.newMessage,
      otherUserId: this.otherUserId,
      currentUserId: this.currentUserId,
    });
  
    if (!this.chatId || !this.newMessage.trim() || !this.otherUserId) {
      console.log("No se puede enviar el mensaje:", {
        chatId: this.chatId,
        newMessage: this.newMessage,
        otherUserId: this.otherUserId,
      });
      return;
    }
  
    const message: ChatMessage = {
      senderId: this.currentUserId!,
      receiverId: this.otherUserId,
      text: this.newMessage,
      timestamp: Date.now(),
    };
  
    console.log("Enviando mensaje:", message);
  
    // Asegúrate de usar el chatId existente
    this.db.list(`chats/${this.chatId}/messages`).push(message).then(() => {
      this.newMessage = ''; // Limpiar el campo de entrada después de enviar
    }).catch(error => {
      console.error("Error al enviar el mensaje:", error);
    });
  }
  goBack() {
    this.navCtrl.back();
  }
}
