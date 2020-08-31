import { NgModule } from '@angular/core';

import {MatButtonModule, MatInputModule, MatCardModule, 
    MatExpansionModule,MatToolbarModule, MatProgressSpinnerModule, MatPaginatorModule, MatDialogModule} from '@angular/material';
    import {MatMenuModule} from '@angular/material/menu';
    
@NgModule({
    exports: [
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatExpansionModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule
    ]
})  
export class AngularMaterialModule {

}