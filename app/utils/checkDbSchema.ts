import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query, 
  limit, 
  orderBy 
} from 'firebase/firestore';

/**
 * Utility function to check Firestore schema and structure
 * This is for development and debugging purposes only
 */
export async function checkFirestoreSchema() {
  try {
    console.log('=== CHECKING FIRESTORE SCHEMA ===');
    
    // Check users collection
    const usersSnapshot = await getDocs(query(collection(db, 'users'), limit(5)));
    console.log(`Users collection: ${usersSnapshot.size} documents found`);
    
    if (usersSnapshot.size > 0) {
      // Get first user
      const firstUser = usersSnapshot.docs[0];
      console.log(`Sample user ID: ${firstUser.id}`);
      
      // Check user chat sessions
      const userChatsRef = collection(db, 'users', firstUser.id, 'chats');
      const chatsSnapshot = await getDocs(query(userChatsRef, orderBy('updatedAt', 'desc'), limit(5)));
      console.log(`User chats: ${chatsSnapshot.size} documents found`);
      
      if (chatsSnapshot.size > 0) {
        const firstChat = chatsSnapshot.docs[0];
        const chatData = firstChat.data();
        console.log(`Sample chat ID: ${firstChat.id}`);
        console.log(`Chat created at: ${chatData.createdAt?.toDate?.()}`);
        console.log(`Message count: ${chatData.messages?.length || 0}`);
        
        // Show sample messages
        if (chatData.messages?.length > 0) {
          console.log('Sample messages:');
          chatData.messages.slice(0, 2).forEach((msg: any, i: number) => {
            console.log(`  Message ${i+1} - Role: ${msg.role}, Content: ${msg.content.substring(0, 50)}...`);
          });
        }
      }
    }
    
    // Check sessions collection
    const sessionsSnapshot = await getDocs(query(collection(db, 'sessions'), limit(5)));
    console.log(`Auth Sessions: ${sessionsSnapshot.size} documents found`);
    
    // Check accounts collection
    const accountsSnapshot = await getDocs(query(collection(db, 'accounts'), limit(5)));
    console.log(`OAuth Accounts: ${accountsSnapshot.size} documents found`);
    
    console.log('=== SCHEMA CHECK COMPLETE ===');
    return 'Schema verification completed';
  } catch (error) {
    console.error('Error checking Firestore schema:', error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}
