import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CountriesService } from '../../services/countries.service'
import { Region, SmallCountry } from '../../interfaces/country.interfaces'
import { switchMap, tap } from 'rxjs'

@Component({
    selector: 'app-selector-page',
    standalone: false,
    templateUrl: './selector-page.component.html',
    styleUrl: './selector-page.component.css',
})
export class SelectorPageComponent implements OnInit {
    private _fb: FormBuilder = new FormBuilder()
    public countriesByRegion: SmallCountry[] = []
    public myForm: FormGroup = this._fb.group({
        region: ['', Validators.required],
        countries: ['', Validators.required],
        borders: ['', Validators.required],
    })

    constructor(private _countriesService: CountriesService) {}

    // ya se tiene acceso al formulario y las inyecciones del constructor
    ngOnInit(): void {
        this.onRegionChange()
    }

    get regions(): Region[] {
        return this._countriesService.regions
    }

    onRegionChange(): void {
        this.myForm
            .get('region')!
            .valueChanges.pipe(
                // switchMap(this._countriesService.getCountriesByRegion)
                // tap(() => this.myForm.get('countries')!.setValue('')),
                switchMap((region) =>
                    this._countriesService.getCountriesByRegion(region)
                )
            )
            .subscribe((countries) => {
                // console.log({ region: countries })
                this.countriesByRegion = countries
            })
    }
}
