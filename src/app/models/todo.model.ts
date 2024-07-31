export interface Todo {
  _id: string;  // Ajoutez cette ligne
  id?: number;  // Gardez-le optionnel pour la compatibilité
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}