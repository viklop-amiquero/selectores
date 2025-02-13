import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'app-selector-page',
    standalone: false,
    templateUrl: './selector-page.component.html',
    styleUrl: './selector-page.component.css',
})
export class SelectorPageComponent {
    private _fb: FormBuilder = new FormBuilder()

    public myForm: FormGroup = this._fb.group({
        region: ['', Validators.required],
        countries: ['', Validators.required],
        borders: ['', Validators.required],
    })
}
