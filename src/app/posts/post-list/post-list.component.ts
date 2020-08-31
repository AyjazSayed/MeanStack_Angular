import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from './../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from './../../auth/auth.service';


@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
    // posts = [
    //     {title: 'First Title', content: 'This is first post\'s Content'},
    //     {title: 'Second Title', content: 'This is second post\'s Content'},
    //     {title: 'Third Title', content: 'This is third  post\'s Content'}
    // ]
  posts: Post[] = [];
  postSubs: Subscription;
  authListenerSubs: Subscription;
  isUserAuthenticated = false;
  isLoading = false;
  userId: string;
  currentPage = 1;
  totalPosts = 0;
  pageSize=15;
  pageSizeOptions = [5, 10, 25, 50];
    constructor(public postsService: PostsService, private authService: AuthService) {}

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.pageSize, this.currentPage);
        this.userId = this.authService.getUserId()
        this.postSubs = this.postsService.getPostUpdatedListner().subscribe((postData : {posts: Post[], totalNumberOfPosts: number}) => {
            this.posts = postData.posts;
            this.totalPosts = postData.totalNumberOfPosts;
            this.isLoading = false;
        }); 
        this.isUserAuthenticated = this.authService.getIsAuth();
        this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.isUserAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
        })
    }

    ngOnDestroy() {
        this.postSubs.unsubscribe();
        this.authListenerSubs.unsubscribe();
    }

    onDelete(postId: string) {
        this.isLoading = true;
        this.postsService.deletePost(postId).subscribe((res) => {
            this.postsService.getPosts(this.pageSize, this.currentPage);
        }, () => {
            this.isLoading = false;
        });
    }

    onPageChange(event: PageEvent) {
        this.currentPage = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.postsService.getPosts(this.pageSize, this.currentPage);
    }
    
}