
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/'; 

@Injectable({
    providedIn: 'root'
}) 
export class PostsService {
    
     posts: Post[] = [];
     
     private postsUpdated = new Subject<{posts: Post[], totalNumberOfPosts: number}>(); 

     constructor(private http: HttpClient, private router: Router){}

     getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`
        this.http.get<{msg: string, posts: any, maxPosts: number }>(BACKEND_URL +queryParams)
        .pipe(map((postsData) => {
            return {
               posts: postsData.posts.map(post => {
                  return {
                     id: post._id,
                     title: post.title,
                     content: post.content,
                     imagePath: post.imagePath,
                     creator: post.creator
                  }
               }), maxPosts: postsData.maxPosts
            }        
        })
        )
        .subscribe((transformPosts) => {
            this.posts = transformPosts.posts;
            this.postsUpdated.next({posts: [...this.posts], totalNumberOfPosts: transformPosts.maxPosts});
        })
     }
  
     getPostUpdatedListner() {
        return this.postsUpdated.asObservable();
     }

     addPost(title: string, content: string, image: File) {
        const postData =  new FormData();
        postData.append('title', title );
        postData.append('content', content );
        postData.append('image', image, title);

       this.http.post<{post: Post, msg: string}>(BACKEND_URL,  postData).subscribe((resData) => {
        this.router.navigate(['/']);
       })
     }

     getPostById(postId : string) {
        return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(BACKEND_URL+postId)
     }

     updatePost(id: string, title: string, content: string, image: File | string) {
      let postData : Post | FormData;  
      if(typeof(image) === "object") {
         postData = new FormData();
         postData.append('id', id );
         postData.append('title', title );
         postData.append('content', content );
         postData.append('image', image, title);
        }else {
         postData = {id, title, content, imagePath: image, creator: null}
        }
      this.http.put(BACKEND_URL +id, postData)
      .subscribe((res) => {
         this.router.navigate(['/']);
      })
     }

     deletePost(postId: string) {
      return this.http.delete(BACKEND_URL + postId);
    }
  
}