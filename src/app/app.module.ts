import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CorekService } from './services/corek/corek.service';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationVComponent } from './navigation-v/navigation-v.component';
import { UsersComponent } from './users/users.component';
import { CarsComponent } from './cars/cars.component';
import { DetailsUserComponent } from './details-user/details-user.component';
import { DetailsCarComponent } from './details-car/details-car.component';
import { HistoryTravelsComponent } from './history-travels/history-travels.component';
import { DetailsTravelsComponent } from './details-travels/details-travels.component';
import { AuthGuard } from './services/guard/auth.guard';
import { AuthService } from './services/guard/auth.service';
import { SessionGuard } from './services/guard/session.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { CommunitiesComponent } from './communities/communities.component';
import { DialogComponent } from './dialogs/create-user/dialog.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule, MatTableModule, MatCheckboxModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule} from '@angular/material/';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {SearchFilterPipe} from './pipes/search.pipe';
import { PhotosUsersComponent } from './dialogs/photos-users/photos-users.component';
import { PhotoLicComponent } from './dialogs/photo-lic/photo-lic.component';
import { SoatComponent } from './dialogs/photos-cars/soat/soat.component';
import { PhotosSecurityComponent } from './dialogs/photos-cars/photos-security/photos-security.component';
import { TecnomecanicaComponent } from './dialogs/photos-cars/tecnomecanica/tecnomecanica.component';
import { PropiedadComponent } from './dialogs/photos-cars/propiedad/propiedad.component';
import { SoatBackComponent } from './dialogs/photos-cars/soat-back/soat-back.component';
import { RecoveryComponent } from './dialogs/recovery/recovery.component';
import { ChangePhotoComponent } from './dialogs/change-photo/change-photo.component';
import { ChangePwdComponent } from './dialogs/change-pwd/change-pwd.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { RegisterHeroComponent } from './register-hero/register-hero.component';
import { PaymentsComponent } from './payments/payments.component';
import { SupportMessageComponent } from './support-message/support-message.component';
import { UsersMessageComponent } from './users-message/users-message.component';
import { MessagesComponent } from './messages/messages.component';
import { DatePipe } from '@angular/common';
import { ChatComponent } from './dialogs/chat/chat.component';
import {HttpClientModule} from '@angular/common/http';
import { UpimagesService } from './services/upimages-web/upimages.service';
import {Md5} from 'ts-md5/dist/md5';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MarcaComponent } from './marca/marca.component';
import { LugaresMatriculasComponent } from './lugares-matriculas/lugares-matriculas.component';
import { LineasComponent } from './lineas/lineas.component';
import { Select2Module } from 'ng2-select2';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import {MatPaginatorModule} from '@angular/material';


const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
    canActivate: [SessionGuard] 
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [SessionGuard]     
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: "historial-viajes",
    component: HistoryTravelsComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: "detalles-viajes",
    component: DetailsTravelsComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "detalles-carro",
    component: DetailsCarComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "detalles-usuario/:id",
    component: DetailsUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "detalles-usuario",
    component: DetailsUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "users",
    component: UsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "cars",
    component: CarsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "communities",
    component: CommunitiesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "payments",
    component: PaymentsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "users-message",
    component: UsersMessageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "support-message",
    component: SupportMessageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "messages/:id",
    component: MessagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "matriculas",
    component: LugaresMatriculasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "marcas",
    component: MarcaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "lineas",
    component: LineasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "terminos-condiciones",
    component: TermsConditionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];

@NgModule({
  declarations: [
    // FileSelectDirective,
    AppComponent,
    DashboardComponent,
    NavigationComponent,
    LoginComponent,
    NavigationVComponent,
    UsersComponent,
    CarsComponent,
    DetailsUserComponent,
    DetailsCarComponent,
    HistoryTravelsComponent,
    DetailsTravelsComponent,
    NotFoundComponent,
    CommunitiesComponent,
    DialogComponent,
    SearchFilterPipe,
    PhotosUsersComponent,
    PhotoLicComponent,
    SoatComponent,
    PhotosSecurityComponent,
    TecnomecanicaComponent,
    PropiedadComponent,
    SoatBackComponent,
    RecoveryComponent,
    ChangePhotoComponent,
    ChangePwdComponent,
    RegisterHeroComponent,
    PaymentsComponent,
    SupportMessageComponent,
    UsersMessageComponent,
    MessagesComponent,
    ChatComponent,
    MarcaComponent,
    LugaresMatriculasComponent,
    LineasComponent,
    TermsConditionComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    RouterModule.forRoot(routes),
    Select2Module,
    MatPaginatorModule,
  ],
  entryComponents:[
    SoatBackComponent,TecnomecanicaComponent,PropiedadComponent ,DialogComponent,PhotosUsersComponent,PhotoLicComponent,SoatComponent,PhotosSecurityComponent,
    RecoveryComponent, ChangePhotoComponent, ChangePwdComponent, RegisterHeroComponent, ChatComponent, 
  ],
  providers: [Md5, UpimagesService,CorekService,AuthGuard,AuthService,SessionGuard, DatePipe, MatDatepickerModule,MatPaginatorModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
