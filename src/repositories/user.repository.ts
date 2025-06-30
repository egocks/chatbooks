import { BaseRepository } from './base.repository';
import { Database } from '../types/supabase';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export class UserRepository extends BaseRepository<User, UserInsert, UserUpdate> {
  constructor() {
    super('users');
  }

  /**
   * Get a user by email
   */
  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return null;
      }
      console.error('Error fetching user by email:', error);
      throw error;
    }

    return data as User;
  }

  /**
   * Get users by role
   */
  async getByRole(role: 'author' | 'reader' | 'admin'): Promise<User[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('role', role);

    if (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }

    return data as User[];
  }
}
