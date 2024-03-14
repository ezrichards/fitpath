export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      exercise: {
        id?: number,
        name?: string,
        gif?: string,
        description?: string,
        recommendations?: string,
        unit?: string
      }
    }
  }
}
