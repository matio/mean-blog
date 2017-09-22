import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthenticationService } from '../shared/services/authentication.service';
import { UserModel } from './shared/user.model';
import { UserService } from './shared/user.service';
import { RouteNamesService } from '../shared/services/route-names.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  user: UserModel;
  isMine: Boolean;
  sub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private userService: UserService,
    private routeNamesService: RouteNamesService,
  ) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.sub = this.route.params.subscribe( params => {

      const userId = params['_userId'];
      this.userService.getById(userId).subscribe(user => {
        this.isMine = user._id === this.auth.loginUser._id;
        this.user = user as UserModel;
        this.routeNamesService.name.next('');
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}