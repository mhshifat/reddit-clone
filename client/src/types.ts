export interface IUser {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPost {
  identifier: string;
  title: string;
  body?: string;
  slug: string;
  subName: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  sub?: ISub;

  url?: string;
  commentCount?: number;
  voteScore?: number;
  userVote?: number;
}

export interface ISub {
  name: string;
  title: string;
  description?: string;
  imageUrn: string;
  bannerUrn: string;
  username: string;
  posts: IPost[];
  createdAt: string;
  updatedAt: string;

  imageUrl: string;
  bannerUrl?: string;
  postCount?: number;
}

export interface IComment {
  body: string;
  username: string;
  identifier: string;
  createdAt: string;
  updatedAt: string;
  post: IPost;

  userVote?: number;
  voteScore?: number;
}
