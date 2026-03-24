export interface UserProfile {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface Post {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
  createdAt: number;
}
