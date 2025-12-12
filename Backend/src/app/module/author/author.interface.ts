// Interface for the Author document
export interface IAuthor {
  name: string;
  slug: string;
  bio?: string;
  birthDate?: Date;
  profileImage?: string;
  isDeleted: boolean;
  updatedAt?: Date;
}

export interface IAuthorPayload {
  name: string;
  bio?: string;
  birthDate?: Date;
  profileImage?: string;
}
