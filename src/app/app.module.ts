import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DocumentAutoCaptureComponent } from './components/document-auto-capture/document-auto-capture.component';
import { FaceAutoCaptureComponent } from './components/face-auto-capture/face-auto-capture.component';
import { ResultComponent } from './components/result/result.component';
import { ComponentSelectComponent } from './components/component-select/component-select.component';
import { DocumentCameraComponent } from './components/document-camera/document-camera.component';
import { DocumentUiComponent } from './components/document-ui/document-ui.component';
import { FaceUiComponent } from './components/face-ui/face-ui.component';
import { FaceCameraComponent } from './components/face-camera/face-camera.component';
import { MagnifEyeLivenessCameraComponent } from './components/magnifeye-liveness-camera/magnifeye-liveness-camera.component';
import { MagnifEyeLivenessUiComponent } from './components/magnifeye-liveness-ui/magnifeye-liveness-ui.component';
import { MagnifEyeLivenessComponent } from './components/magnifeye-liveness/magnifeye-liveness.component';
import { SmileLivenessCameraComponent } from './components/smile-liveness-camera/smile-liveness-camera.component';
import { SmileLivenessUiComponent } from './components/smile-liveness-ui/smile-liveness-ui.component';
import { SmileLivenessComponent } from './components/smile-liveness/smile-liveness.component';
import { HttpClientModule } from '@angular/common/http';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { LoginComponent } from './components/login/login.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { SuccessErrorComponent } from './components/success-error/success-error.component';

@NgModule({
  declarations: [
    AppComponent,
    DocumentAutoCaptureComponent,
    FaceAutoCaptureComponent,
    ResultComponent,
    ComponentSelectComponent,
    DocumentCameraComponent,
    DocumentUiComponent,
    FaceUiComponent,
    FaceCameraComponent,
    MagnifEyeLivenessCameraComponent,
    MagnifEyeLivenessUiComponent,
    MagnifEyeLivenessComponent,
    SmileLivenessCameraComponent,
    SmileLivenessUiComponent,
    SmileLivenessComponent,
    UserRegistrationComponent,
    LoginComponent,
    NavigationComponent,
    HomeComponent,
    SuccessErrorComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [BrowserModule, HttpClientModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
