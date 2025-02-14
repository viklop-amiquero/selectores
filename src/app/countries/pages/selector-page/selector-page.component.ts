import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CountriesService } from '../../services/countries.service'
import { Region, SmallCountry } from '../../interfaces/country.interfaces'
import { filter, switchMap, tap } from 'rxjs'

@Component({
    selector: 'app-selector-page',
    standalone: false,
    templateUrl: './selector-page.component.html',
    styleUrl: './selector-page.component.css',
})
export class SelectorPageComponent implements OnInit {
    private _fb: FormBuilder = new FormBuilder()
    public countriesByRegion: SmallCountry[] = []
    public borders: SmallCountry[] = []
    public myForm: FormGroup = this._fb.group({
        region: ['', Validators.required],
        country: ['', Validators.required],
        border: ['', Validators.required],
    })

    constructor(private _countriesService: CountriesService) {}

    // ya se tiene acceso al formulario y las inyecciones del constructor
    ngOnInit(): void {
        this.onRegionChanged()
        this.onCountryChanged()
    }

    get regions(): Region[] {
        return this._countriesService.regions
    }

    onRegionChanged(): void {
        this.myForm
            .get('region')!
            .valueChanges.pipe(
                tap(() => this.myForm.get('country')!.setValue('')),
                tap(() => (this.borders = [])),
                switchMap((region) =>
                    this._countriesService.getCountriesByRegion(region)
                )
            )
            .subscribe((countries) => {
                // console.log({ region: countries })
                this.countriesByRegion = countries
            })
    }

    onCountryChanged(): void {
        this.myForm
            .get('country')!
            .valueChanges.pipe(
                tap(() => this.myForm.get('border')!.setValue('')),
                filter((value: string) => value.length > 0),
                switchMap((alphaCode) =>
                    this._countriesService.getCountryByAlphaCode(alphaCode)
                ),
                switchMap((country) =>
                    this._countriesService.getCountryBordersByCodes(
                        country.borders
                    )
                )
            )
            .subscribe((countries) => {
                this.borders = countries
            })
    }
}
