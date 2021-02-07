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
}
