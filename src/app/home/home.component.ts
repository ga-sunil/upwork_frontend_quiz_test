import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { HomeService } from '../home/services/home.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  posts: any = [];
  PostData = {
    title: '',
    body: '',
    userId: 1
  }
  selectedPost = {
    id: 0,
    title: '',
    body: '',
    userId: 1
  };
  selectedIndex: 0;

  constructor(private _homeService: HomeService,
    private _modalService: NgbModal,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.loadData();
  }

  ngAfterViewInit() {
    this.reRender();
  }

  reRender(): void {
    if (this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
  }

  loadData() {
    this._homeService.loadData().subscribe(result => {
      if (result) {
        this.posts = result;
        this.dtTrigger.next();
      }
    })
  }

  addPost(formPost) {
    if (formPost.valid) {
      this._homeService.addPost(this.PostData).subscribe(result => {
        if (result) {
          this.toastr.success('Post added successfully', 'Sucess');
          this.posts.push(result);
          formPost.reset();
          this.closeModal();
          this.reRender();
        }
      });
    }
  }

  saveEditPost() {
    this.posts[this.selectedIndex] = this.selectedPost;
    this.toastr.success('Post updated successfully', 'Sucess');
    this.closeModal();
    this.reRender();
  }

  deletePost() {
    this.posts.splice(this.selectedIndex, 1);
    this.toastr.success('Post deleted successfully', 'Sucess');
    this.closeModal();
    this.reRender();
  }

  openModal(content, post, index) {
    this.selectedIndex = index;
    this.selectedPost = { ...post };
    this._modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
  }

  closeModal() {
    this._modalService.dismissAll();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
